import Users from "../../../models/UserModel";

export default async function handler(req, res) {
  const { confirmation } = req.query;
  const user = await Users.findOne({
    jwt: confirmation,
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.status = true;
  await user.save();
  return res.status(200).json({ message: "User is active" });
}
