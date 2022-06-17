import { Schema, model, models } from "mongoose";

const apiKeyLabel = new Schema({
  name: String,
  apiKey: String,
});

const userSchema = new Schema(
  {
    username: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    apiKeys: {
      type: [{ name: String, apiKey: String }],
      default: [],
    },
    apiKeyLimit: { type: Number, default: 2 },
  },
  { collection: "testusers" }
);

const Users = models.Users || model("Users", userSchema);

export default Users;
