import bcrypt from "bcrypt";
import Users from "../../models/UserModel";
import jwt from "jsonwebtoken";
import sendEmail from "../../helpers/sendEmail";
import absoluteUrl from "next-absolute-url";

export default async function handler(req, res) {
  const body = req.body;
  const name = body.firstName.trim() + " " + body.lastName.trim();

  const token = jwt.sign({ email: body.email }, process.env.JWT_SECRET);
  const checkExisting = await Users.findOne({ email: body.email });
  if (checkExisting) {
    res.status(200).json({ message: "Already registered" });
    return;
  }
  const user = new Users({
    name,
    email: body.email,
    password: body.password,
    jwt: token,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const { origin } = absoluteUrl(req);
  const link = `${origin}/api/confirm/${token}`;
  const message = `<div>Click on the link below to verify your email, if the link is not working then please paste into the browser.</div></br>
    <div>Link: ${link}</div>`;

  /*
  sendEmail({
    to: body.email,
    subject: "Please confirm your account",
    html: message,
  });
  */

  return res.status(200).json({
    message: "Registered successfully!",
  });
}
