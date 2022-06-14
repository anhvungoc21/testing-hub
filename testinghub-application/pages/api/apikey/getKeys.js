import { connectToDatabase } from "../../../lib/mongodb";
import Users from "../../../models/UserModel";

export default async function handler(req, res) {
  const email = req.query.email;
  const user = await Users.findOne({ email: email });
  return res.status(200).json({ data: user.apiKeys });
}
