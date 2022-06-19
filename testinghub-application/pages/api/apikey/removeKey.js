import Users from "../../../models/UserModel";

export default async function handler(req, res) {
  const body = req.body;
  // await Users.deleteOne({ name });
  const removeKey = await Users.updateOne(
    { email: body.email },
    { $pull: { apiKeys: { name: body.name } } },
    { multi: true }
  );
  if (removeKey) {
    return res.status(200).json({ message: "API key deleted" });
  }
  return res
    .status(200)
    .json({ message: "Unable to remove API key. Please try again later!" });
}
