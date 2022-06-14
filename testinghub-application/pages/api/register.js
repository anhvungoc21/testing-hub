import bcrypt from "bcrypt";
import Users from "../../models/UserModel";

export default async function handler(req, res) {
  const body = req.body;
  const checkExisting = await Users.findOne({ email: body.email });
  console.log("Check existing", checkExisting);
  if (checkExisting) {
    res.status(200).json({ message: "Already registered" });
    return;
  }
  const user = new Users(body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.status(200).json({ message: "Registered successfully" });
}
