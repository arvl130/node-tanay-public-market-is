const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (tenant_uid) => {
  const colSnap = await db
    .collection("tpmis_stores")
    .where("owner_uid", "!=", "")
    .get();

  const tenantUIDsWithStores = [];

  if (!colSnap.empty) {
    colSnap.forEach((doc) => {
      const data = doc.data();
      const tenant_uid = data.owner_uid;
      if (!tenantUIDsWithStores.includes(tenant_uid))
        tenantUIDsWithStores.push(tenant_uid);
    });
  }

  return tenantUIDsWithStores;
};
