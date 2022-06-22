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
}
