import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";

export const generateConfirmationToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token ważny 1 godzinę
};

export const sendEmail = async (to, subject, html, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: subject,
        pass: token,
      },
    });

    await transporter.sendMail({
      from: `"Chat application Demo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("E-mail wysłany!");
  } catch (error) {
    console.error("Błąd wysyłania e-maila:", error);
  }
};
