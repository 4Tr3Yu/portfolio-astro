export default async function contact(req, res) {
	const { method } = req;
	if (method === "POST") {
		const { name, email, message, lang } = req.body; // check if i can make lang come from the headers
		const defaultLang = lang || "es";
		const messages = {
			missingFields: {
				es: "Por favor, rellena todos los campos",
				en: "Please fill all fields",
			},
			success: {
				es: "Mensaje enviado correctamente",
				en: "Message sent successfully",
			},
		};
		
		if ( !name || !email || !message ) {
			return res.status(406).json({ error: messages.missingFields[defaultLang] });
		}

		console.log("Name: ", name);
		console.log("Email: ", email);
		console.log("Message: ", message);

	}
}