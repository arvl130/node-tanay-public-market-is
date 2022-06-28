const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

const deleteUserRecordsFromCollection = async (uid, collection) => {
  const collectionRef = db.collection(collection);
  const snapshot = await collectionRef.where("tenant_uid", "==", uid).get();
  if (!snapshot.empty) {
    snapshot.forEach(async (doc) => {
      await db.collection(collection).doc(doc.id).delete();
    });
  }
};

module.exports = async (req, res) => {
  try {
    const uid = req.params.uid;

    if (!uid) {
      res.status(400).json({
        message: "Invalid or missing UID",
      });
    }

    // Reset stores owned by tenant.
    const storesRef = db.collection("tpmis_stores");
    const storesSnapshot = await storesRef.where("owner_uid", "==", uid).get();
    if (!storesSnapshot.empty) {
      storesSnapshot.forEach(async (doc) => {
        await db.collection("tpmis_stores").doc(doc.id).set(
          {
            owner_uid: "",
          },
          { merge: true }
        );
      });
    }

    const collectionsToDeleteFrom = [
      "tpmis_payments",
      "tpmis_receipts",
      "tpmis_tickets",
      "tpmis_letters",
    ];

    // Delete data related to user.
    collectionsToDeleteFrom.forEach(async (collection) => {
      await deleteUserRecordsFromCollection(uid, collection);
    });

    // Delete user from users list.
    await db.collection("tpmis_users").doc(uid).delete();

    // Delete user from auth.
    const userRecord = await auth.deleteUser(uid);

    res.status(200).json({
      message: "Used deleted.",
      user: userRecord,
    });
  } catch (e) {
    res.status(500).json({
      message: `Error occured while deleting user: ${e.message}`,
    });
  }
};
