import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { db } = await connectToDatabase();
    const users = db.collection("users");

    // Insert database queries here
    const { name, email, apiKeys } = req.body;

    const checkExisting = await users.findOne({ email: email });
    // console.log("Check Existing: " + checkExisting);
    // Send error response if duplicate user is found
    if (checkExisting) {
      return res.status(422).json({ message: "User already exists" });
    }

    users.insertOne({ name: name, email: email, apiKeys: apiKeys });

    // Send success response
    return res.status(201).json({ message: "User created" });
  }
}
