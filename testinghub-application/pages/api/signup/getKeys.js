import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  const email = req.query.email;
  const { db } = await connectToDatabase();
  const users = db.collection("users");
  const user = await users.findOne({ email: email });
  return res.status(200).json({ data: user.apiKeys });
}
