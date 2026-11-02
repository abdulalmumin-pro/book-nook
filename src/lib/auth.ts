import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Reuse the MongoDB client across hot reloads in development so we don't open
// a new topology for every recompiled module, and so a client configured with
// a stale env value doesn't stick around after an env reload.
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

function getMongoClient(): MongoClient {
  if (globalWithMongo._mongoClient) {
    return globalWithMongo._mongoClient;
  }
  globalWithMongo._mongoClient = new MongoClient(
    process.env.MONGODB_URI as string,
    {
      // Fail fast instead of blocking the request for the default 30s.
      serverSelectionTimeoutMS: 5000,
    },
  );
  return globalWithMongo._mongoClient;
}

const client = getMongoClient();
const db = client.db("book-nook");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [jwt()],
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
