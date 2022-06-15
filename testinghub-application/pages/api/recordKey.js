import { connectToDatabase } from "../../lib/mongodb";
import Users from "../../models/UserModel";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { email, apiKeyName, apiKey } = req.body;

    const user = await Users.findOne({ email });
    // console.log("User " + user);
    // Send error response if duplicate user is found
    const apiKeysArr = user.apiKeys;
    console.log(apiKeysArr);

    if (user.apiKeyLimit <= apiKeysArr.length) {
      return res
        .status(200)
        .json({ message: "API key limit exceeded. Unable to add API key. " });
    }
    for (let i = 0; i < apiKeysArr.length; i++) {
      if (
        apiKeysArr[i].name == apiKeyName.toUpperCase() &&
        apiKeysArr[i].apiKey == apiKey
      ) {
        return res
          .status(200)
          .json({ message: "API key and name already existed" });
      } else if (apiKeysArr[i].name == apiKeyName.toUpperCase()) {
        return res
          .status(200)
          .json({ message: "API key name already existed" });
      } else if (apiKeysArr[i].apiKey == apiKey) {
        return res.status(200).json({ message: "API key already existed" });
      }
    }

    const req_fake_test = await fetch(
      process.env.NEXTAUTH_URL + "/api/tests/fakeTestRun",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      }
    );
    if (!req_fake_test.ok) {
      return res
        .status(200)
        .json({ message: "API key not valid. Please try again!" });
    } else {
      const newApiKey = { name: apiKeyName.toUpperCase(), apiKey: apiKey };
      await Users.findOneAndUpdate(
        { email: email },
        { $push: { apiKeys: newApiKey } }
      );
      // Send success response
      return res.status(200).json({ message: "API key added" });
    }
  }
}
