import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: "gmail",
	port: 587,
	secure: false, // true for port 465, false for other ports
	auth: {
	  user: process.env.USER_MAIL, 
	  pass: process.env.PASS_MAIL,
	},
});

const main = async () => {
	const info = await transporter.sendMail({
	  from: '"Fred Foo 👻" <jorgef.aguir@gmail.com>',
	  to: "jorgef.aguir@gmail.com",
	  subject: "Hello ✔",
	  text: "Hello world?",
	  html: "<b>Hello world?</b>",
	});
	console.log("Message sent: %s", info.messageId);
	return info;
}

export default main;