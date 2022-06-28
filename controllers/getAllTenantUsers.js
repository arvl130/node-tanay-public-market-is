const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (req, res) => {
  try {
    const usersRef = db.collection("tpmis_users");
    const snapshot = await usersRef.where("account_type", "==", "tenant").get();
    const users = [];

    if (snapshot.empty) {
      res.status(200).json({
        message: "List of all tenant users.",
        users,
      });
      return;
    }

    snapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      message: "List of all tenant users.",
      users,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error occured while fetching all users.",
    });
  }
};
