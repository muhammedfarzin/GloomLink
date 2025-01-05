import nodemailer from "nodemailer";

export const sendMail = async (email: string, title: string, body: string) => {
  // Create a Transporter to send emails
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Send email to the Users
  let info = await transporter.sendMail({
    from: "Bitkart",
    to: email,
    subject: title,
    html: body,
  });
  return info;
};
