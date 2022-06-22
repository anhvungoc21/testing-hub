import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String },
    apiKeys: {
      type: [{ name: String, apiKey: String }],
      default: [],
    },
    apiKeyLimit: { type: Number, default: 2 },
    jwt: { type: String, unique: true },
    status: { type: Boolean, default: false },
  },
  { collection: "testusers" }
);

const Users = models.Users || model("Users", userSchema);

export default Users;
