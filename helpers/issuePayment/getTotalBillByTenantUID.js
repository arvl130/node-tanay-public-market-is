const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (tenant_uid) => {
  const storeListSnapshot = await db
    .collection("tpmis_stores")
    .where("owner_uid", "==", tenant_uid)
    .get();

  const storesList = [];

  if (!storeListSnapshot.empty) {
    storeListSnapshot.forEach((doc) => {
      storesList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  }

  const bill = storesList.reduce((runningAmount, store) => {
    return runningAmount + store.monthlyCost;
  }, 0);

  return bill;
};
