import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // डेवलपमेंट मोड में, हम बार-बार नया कनेक्शन नहीं बनाते (Hot Reloading की वजह से)
  // हम एक ग्लोबल वेरिएबल का इस्तेमाल करते हैं ताकि कनेक्शन बना रहे।
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // प्रोडक्शन मोड में ग्लोबल वेरिएबल का इस्तेमाल न करना ही बेहतर है।
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// इसे एक्सपोर्ट करें ताकि इसे API फाइल्स में इस्तेमाल किया जा सके
export default clientPromise;