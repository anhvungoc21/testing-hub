import Users from "../../models/UserModel";
import jwt from "jsonwebtoken";
import absoluteUrl from "next-absolute-url";
import sendEmail from "../../helpers/sendEmail";

export default async function handler(req, res) {
  const email = req.body.email;
  const user = Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  user.resetToken = token;
  await user.save();

  const { origin } = absoluteUrl(req);
  const link = `${origin}/reset/${token}`;

  const message = `<div>Click on the link below to reset your password, if the link is not working then please paste into the browser.</div></br>
    <div>Link: ${link}</div>`;

  sendEmail({
    to: email,
    subject: "Password Reset",
    html: message,
  });

  return res.status(200).json({
    message: `Email sent to ${email}. Please check your email!`,
  });
}
