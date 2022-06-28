const { initializeApp, cert } = require("firebase-admin/app");
const firebaseConfig = process.env.FIREBASE_CONFIG || "";
const serviceAccount = JSON.parse(firebaseConfig);
initializeApp({ credential: cert(serviceAccount) });
