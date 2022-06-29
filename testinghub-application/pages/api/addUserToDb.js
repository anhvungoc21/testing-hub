import Users from "../../models/UserModel";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const body = req.body;
  const checkExisting = await Users.findOne({ email: body?.email });
  if (checkExisting) {
    return res.status(200).json({ message: "Already registered" });
  }
  const token = jwt.sign({ email: body.email }, process.env.JWT_SECRET);
  const user = new Users({
    name: body.name,
    email: body.email,
    jwt: token,
    status: true,
  });
  await user.save();
  return res.status(200).json({ message: "New user registered" });
}
