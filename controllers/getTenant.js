const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const auth = getAuth();
const db = getFirestore();

module.exports = async (req, res) => {
  try {
    const uid = req.params.uid;

    if (!uid) {
      res.status(400).json({
        message: "Invalid or missing UID.",
      });
      return;
    }

    const doc = await db.collection("tpmis_users").doc(uid).get();
    if (!doc.exists) {
      res.status(404).json({
        message: "No such user.",
      });
      return;
    }

    const data = doc.data();

    if (data.account_type !== "tenant") {
      res.status(404).json({
        message: "No such user.",
      });
      return;
    }

    const userRecord = await auth.getUser(uid);
    const username = userRecord.email.split("@")[0];

    const user = {
      uid: doc.id,
      username,
      ...data,
    };

    res.status(200).json({
      message: "User found.",
      user,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error occured while fetching all users.",
    });
  }
};
