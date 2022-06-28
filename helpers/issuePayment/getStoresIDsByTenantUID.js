const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (tenant_uid) => {
  const colSnap = await db
    .collection("tpmis_stores")
    .where("owner_uid", "==", tenant_uid)
    .get();

  const storesByTenantUID = [];

  if (!colSnap.empty) {
    colSnap.forEach((doc) => {
      storesByTenantUID.push(doc.id);
    });
  }

  return storesByTenantUID;
};
