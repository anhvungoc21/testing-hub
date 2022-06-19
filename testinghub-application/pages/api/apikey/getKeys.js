import { connectToDatabase } from "../../../lib/mongodb";
import Users from "../../../models/UserModel";

export default async function handler(req, res) {
  const email = req.body.email;
  const user = await Users.findOne({ email });
  const apiKeysDBArr = user?.apiKeys;

  const apiKeysArr = [];
  if (apiKeysDBArr) {
    for (let i = 0; i < apiKeysDBArr.length; i++) {
      const apiKeyLabelObj = {};
      apiKeyLabelObj["name"] = apiKeysDBArr[i].name;
      apiKeyLabelObj["apiKey"] = apiKeysDBArr[i].apiKey;
      apiKeysArr.push(apiKeyLabelObj);
    }
  }
  // console.log(apiKeysArr);
  return res
    .status(200)
    .json({ data: apiKeysArr, apiKeyLimit: user?.apiKeyLimit });
}
