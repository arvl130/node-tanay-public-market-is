const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (payment) => {
  try {
    await db.collection("tpmis_payments").add(payment);
    console.log("Added payment:", payment);
  } catch {
    console.log("Error while adding payment:", e, payment);
  }
};
