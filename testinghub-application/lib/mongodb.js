import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

let client;
let clientPromise;

if (!process.env.MONGO_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/* const { MONGO_URI, MONGO_DB } = process.env;

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
} */
