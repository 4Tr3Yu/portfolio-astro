import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // true for port 465, false for other ports
	auth: {
	  user: process.env.USER_MAIL, 
	  pass: process.env.USER_PASS,
	},
});

const escapeHtml = (str) =>
	String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");

const main = async (name, email, message) => {
	const safeName = escapeHtml(name);
	const safeEmail = escapeHtml(email);
	const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");

	const info = await transporter.sendMail({
	  from: '"Atre.dev" <contact@atre.dev>',
	  to: "jorgef.aguir@gmail.com",
	  replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
	  subject: `Portfolio contact | ${name}`,
	  text: `${name} <${email}> says:\n\n${message}`,
	  html: `<p><b>${safeName}</b> &lt;<a href="mailto:${safeEmail}">${safeEmail}</a>&gt; says:</p><p>${safeMessage}</p>`,
	});
	console.log("Message sent: %s", info.messageId);
	return info.messageId;
}

export default main;
