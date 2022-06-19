import Users from "../../models/UserModel";

export default async function handler(req, res) {
  const body = req.body;
  console.log("Body: " + body);
  const checkExisting = await Users.findOne({ email: body?.email });
  console.log("Check Existing: " + checkExisting);
  if (checkExisting) {
    return res.status(200).json({ message: "Already registered" });
  }
  const user = new Users(body);
  await user.save();
  return res.status(200).json({ message: "New user registered" });
}
