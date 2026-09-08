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

const clean = (value) => (typeof value === "string" ? value.trim() : "");

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

	try {
		await main(name, email, message);
		return reply(200, "success");
	} catch (error) {
		console.error("Contact form mail error:", error);
		return reply(500, "sendFailed");
	}
}
