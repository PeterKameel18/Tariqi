const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

const getFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin;
  }

  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    // Cloud deployment: read credentials from environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else if (fs.existsSync(serviceAccountPath)) {
    // Local development: read credentials from JSON file
    serviceAccount = require(serviceAccountPath);
  } else {
    throw new Error(
      "Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON env var or provide serviceAccountKey.json",
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin;
};

module.exports = { getFirebaseAdmin };
