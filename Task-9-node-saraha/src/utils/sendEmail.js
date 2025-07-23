import nodemailer from "nodemailer";

export const sendEmail = async ({email, subject, html}) => {
  const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    port: 465,
    service: "gmail",
    secure: true, // true for 465, false for other ports
    auth: {
      user: "mnaz004587@gmail.com",
      pass: "pydprkgigycgmyhj",
    },
  });

  const info = await transporter.sendMail({
    from: '"Ahmed 😘" <mnaz004587@gmail.com>',
    to: email,
    subject: subject || "Hello ✔",
    // text: "Hello world?", // plain‑text body
    html: html || "<b>Hi, Ahmed</b>", // HTML body
  });

  if (info.accepted.length > 0) {
    return true;
  } else {
    return false;
  }
  //   console.log("Message sent:", info.messageId);
};
