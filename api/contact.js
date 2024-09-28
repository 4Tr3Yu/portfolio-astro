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
			return res.status(406).json({ error: messages.missingFields[defaultLang] });
		}

		console.log("Name: ", name);
		console.log("Email: ", email);
		console.log("Message: ", message);
		console.log("Lang: ", lang);

		return res.status(200).json({ status: "success", message: messages.success[defaultLang] });
	} 
	
	res.setHeader("Allow", ["POST"]);
	return res.status(405).json({ error: messages.wrongMethod[defaultLang] });
	
}