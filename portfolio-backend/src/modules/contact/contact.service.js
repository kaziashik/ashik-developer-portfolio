import nodemailer from "nodemailer";
import config from "../../config/index.js"; // adjust path if needed

export const sendContactEmail = async ({ name, email, message }) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });

  const mailOptions = {
    from: email,
    to: config.emailUser,
    subject: `Portfolio Contact: ${name}`,
    text: message,
  };

  return await transporter.sendMail(mailOptions);
};