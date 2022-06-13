import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { db } = await connectToDatabase();
    const users = db.collection("users");

    // Insert database queries here
    const { email, apiKey } = req.body;
    // console.log(email, apiKey);

    const checkExisting = await users.findOne({
      apiKeys: { $in: [apiKey] },
      email: { $in: [email] },
    });
    // console.log("Check Existing: " + checkExisting);
    // Send error response if duplicate user is found
    if (checkExisting) {
      return res.status(422).json({ message: "API key already existed" });
    }

    users.updateOne({ email: email }, { $push: { apiKeys: apiKey } });
    // Send success response
    return res.status(201).json({ message: "API key added" });
  }
}
