const main = require("../services/main");
export default async function contact(req, res) {
	const { method } = req;
	const messages = {
		missingFields: {
			es: "Por favor, rellena todos los campos",
			en: "Please fill all fields",
		},
		wrongMethod: {
			es: "Método no permitido",
			en: "Method not allowed",
		},
		success: {
			es: "Mensaje enviado correctamente",
			en: "Message sent successfully",
		},
	};
	if (method === "POST") {
		const { name, email, message, lang } = req.body; // check if i can make lang come from the headers
		const defaultLang = lang || "es";
		
		if ( !name || !email || !message ) {
			return res.status(406).json({ status: "error", error: messages.missingFields[defaultLang] });
		}

		try {
			const res = await main(name, email, message);
			console.log("Response: ", res);
			return res.status(200).json({ status: "success", message: messages.success[defaultLang] });
		} catch (error) {
			console.log("Error: ", error);
			return res.status(500).json({ status: "error", error: error.message });
		}

	} 

	res.setHeader("Allow", ["POST"]);
	return res.status(405).json({  status: "error", error: messages.wrongMethod[defaultLang] });
	
}