import Users from "../../models/UserModel";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { email, password, newPassword, confirmPassword } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(404).json({ message: "Incorrect current password" });
  }

  const confirmPasswordMatch = newPassword == confirmPassword;
  if (!confirmPasswordMatch) {
    return res.status(404).json({ message: "Confirm password does not match" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = password;
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  return res.status(200).json({ message: "Password changed" });
}
