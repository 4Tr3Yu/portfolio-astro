import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // true for port 465, false for other ports
	auth: {
	  user: process.env.USER_MAIL, 
	  pass: process.env.PASS_MAIL,
	},
});

const main = async (name, email, message) => {
	const info = await transporter.sendMail({
	  from: 'Atre.dev" <contact@atre.dev>',
	  to: "jorgef.aguir@gmail.com",
	  subject: `Portfolio contact | ${name}`,
	  html:  `<b>${name}</b> says: </br> ${message}`,
	});
	console.log("Message sent: %s", info.messageId);
	return info;
}

export default main;