import { connectToDatabase } from "../../../lib/mongodb";
import Users from "../../../models/UserModel";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { email, apiKey } = req.body;

    const checkExisting = await Users.findOne({
      apiKeys: { $in: [apiKey] },
      email: { $in: [email] },
    });
    // console.log("Check Existing: " + checkExisting);
    // Send error response if duplicate user is found
    if (checkExisting) {
      return res.status(422).json({ message: "API key already existed" });
    }

    Users.updateOne({ email: email }, { $push: { apiKeys: apiKey } });
    // Send success response
    return res.status(201).json({ message: "API key added" });
  }
}
