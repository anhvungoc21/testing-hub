import { connectToDatabase } from "../../lib/mongodb";
import Users from "../../models/UserModel";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { email, apiKeyName, apiKey } = req.body;

    const user = await Users.findOne({ email });
    console.log("User " + user);
    // Send error response if duplicate user is found
    if (user.apiKeys?.name == apiKeyName && user.apiKeys?.apiKey == apiKey) {
      return res
        .status(200)
        .json({ message: "API key and name already existed" });
    } else if (user.apiKeys?.name == apiKeyName) {
      return res.status(200).json({ message: "API key name already existed" });
    } else if (user.apikeys?.apiKey == apiKey) {
      return res.status(200).json({ message: "API key already existed" });
    }

    Users.updateOne(
      { email: email },
      { $push: { apiKeys: { name: apiKeyName, apiKey } } }
    );
    // Send success response
    return res.status(200).json({ message: "API key added" });
  }
}
