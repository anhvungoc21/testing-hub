import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    apiKeys: { type: [String], default: [] },
  },
  { collection: "testusers" }
);

const Users = models.Users || model("Users", userSchema);

export default Users;
