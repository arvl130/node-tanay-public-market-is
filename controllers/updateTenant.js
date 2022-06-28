const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (req, res) => {
  try {
    const tenant_uid = req.params.uid;
    const { firstName, lastName, account_type, stores, username } = req.body;

    if (!tenant_uid) {
      res.status(400).json({
        message: "Invalid or missing UID",
      });
      return;
    }

    if (!firstName) {
      res.status(400).json({
        message: "Invalid or missing first name",
      });
      return;
    }

    if (!lastName) {
      res.status(400).json({
        message: "Invalid or missing last name",
      });
      return;
    }

    if (!account_type) {
      res.status(400).json({
        message: "Invalid or missing account type",
      });
      return;
    }

    if (!stores) {
      res.status(400).json({
        message: "Invalid or missing stores",
      });
      return;
    }

    if (!username) {
      res.status(400).json({
        message: "Invalid or missing username",
      });
      return;
    }

    await db.collection("tpmis_users").doc(tenant_uid).set({
      firstName,
      lastName,
      account_type,
    });

    // Reset stores owned by tenant.
    const storesRef = db.collection("tpmis_stores");
    const storesSnapshot = await storesRef
      .where("owner_uid", "==", tenant_uid)
      .get();

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

    // Assign stores to tenant.
    stores.map(async (store) => {
      await db.collection("tpmis_stores").doc(store).set(
        {
          owner_uid: tenant_uid,
        },
        { merge: true }
      );
    });

    // Update username.
    try {
      await auth.updateUser(tenant_uid, {
        email: `${username}@noemail.com`,
      });
    } catch (e) {
      if (e.code === "auth/email-already-exists") {
        res.status(400).json({
          message: "User exists",
        });
        return;
      } else throw e;
    }

    res.status(200).json({
      message: "User updated",
    });
  } catch (e) {
    res.status(500).json({
      message: `Error occured while updating user: ${e.message}`,
    });
  }
};
