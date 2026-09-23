import main from "../services/mailing.js";

const messages = {
	missingFields: {
		es: "Por favor, rellena todos los campos",
		en: "Please fill all fields",
	},
	invalidEmail: {
		es: "El correo no es válido",
		en: "The email address is not valid",
	},
	tooLong: {
		es: "El mensaje es demasiado largo",
		en: "The message is too long",
	},
	wrongMethod: {
		es: "Método no permitido",
		en: "Method not allowed",
	},
	sendFailed: {
		es: "No se pudo enviar el mensaje",
		en: "The message could not be sent",
	},
	captchaFailed: {
		es: "No pudimos verificar que eres humano, inténtalo de nuevo",
		en: "We could not verify you are human, please try again",
	},
	success: {
		es: "Mensaje enviado correctamente",
		en: "Message sent successfully",
	},
};

const SUPPORTED_LANGS = ["es", "en"];
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_TURNSTILE_TOKEN = 2048;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const clean = (value) => (typeof value === "string" ? value.trim() : "");

const clientIp = (req) => {
	const forwarded = req.headers["x-forwarded-for"];
	return typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "";
};

// Shared with the contact form. Unset means enabled.
const isFlagOff = (value) => ["false", "0", "off", "no"].includes(String(value ?? "").trim().toLowerCase());
const captchaEnabled = () => !isFlagOff(process.env.PUBLIC_CAPTCHA_ENABLED);

// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
const verifyTurnstile = async (token, ip) => {
	if (!captchaEnabled()) {
		return true;
	}

	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) {
		console.warn("TURNSTILE_SECRET_KEY is not set; skipping captcha verification");
		return true;
	}
	if (!token || token.length > MAX_TURNSTILE_TOKEN) {
		return false;
	}

	const params = new URLSearchParams({ secret, response: token });
	if (ip) params.set("remoteip", ip);

	try {
		const result = await fetch(TURNSTILE_VERIFY_URL, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: params,
		});
		const data = await result.json();
		if (!data.success) {
			console.warn("Turnstile rejected token:", data["error-codes"]);
		}
		return data.success === true;
	} catch (error) {
		console.error("Turnstile verification error:", error);
		return false;
	}
};

export default async function contact(req, res) {
	const body = req.body && typeof req.body === "object" ? req.body : {};
	const lang = SUPPORTED_LANGS.includes(body.lang) ? body.lang : "es";
	const reply = (status, key) => res.status(status).json({
		status: status < 400 ? "success" : "error",
		message: messages[key][lang],
	});

	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return reply(405, "wrongMethod");
	}

	// Honeypot: real users never see or fill this field. Pretend success so bots move on.
	if (clean(body.website)) {
		return reply(200, "success");
	}

	const name = clean(body.name);
	const email = clean(body.email);
	const message = clean(body.message);

	if (!name || !email || !message) {
		return reply(400, "missingFields");
	}
	if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
		return reply(400, "invalidEmail");
	}
	if (name.length > MAX_NAME || message.length > MAX_MESSAGE) {
		return reply(400, "tooLong");
	}

	if (!(await verifyTurnstile(clean(body.turnstileToken), clientIp(req)))) {
		return reply(400, "captchaFailed");
	}

	try {
		await main(name, email, message);
		return reply(200, "success");
	} catch (error) {
		console.error("Contact form mail error:", error);
		return reply(500, "sendFailed");
	}
}
