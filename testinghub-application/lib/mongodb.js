import { MongoClient } from "mongodb";

const { MONGO_URI, MONGO_DB } = process.env;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment vairable inside .env.local"
  );
}

if (!MONGO_DB) {
  throw new Error(
    "Please define the MONGO_DB environment variable inside .env.local"
  );
}

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGO_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGO_DB),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
