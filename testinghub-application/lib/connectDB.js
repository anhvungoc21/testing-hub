import mongoose from "mongoose";

export default function connectDB() {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected");
    return;
  }

  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  mongoose.connect(process.env.MONGO_URI, opts, (err) => {
    if (err) throw err;
    console.log("Connected successfully");
  });
}
