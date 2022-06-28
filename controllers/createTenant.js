const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const account_type = req.body.account_type;
    const stores = req.body.stores;

    // Validation.
    if (!username) {
      res.status(400).json({
        message: "Invalid or missing username",
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        message: "Invalid or missing password",
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

    const email = `${username}@noemail.com`;

    try {
      await auth.getUserByEmail(email);
      res.status(400).json({
        message: "User exists",
      });
      return;
    } catch (e) {}

    // Create user.
    const userRecord = await auth.createUser({
      email,
      password,
    });

    // Set account type.
    const uid = userRecord.uid;
    auth.setCustomUserClaims(uid, { account_type: "tenant" });

    // Create database record for user.
    await db.collection("tpmis_users").doc(uid).set({
      account_type,
      firstName,
      lastName,
    });

    // Set stores owned by user.
    stores.map(async (store) => {
      db.collection("tpmis_stores").doc(store).set(
        {
          owner_uid: uid,
        },
        { merge: true }
      );
    });

    res.status(201).json({
      message: "User created.",
      user: userRecord,
    });
  } catch (e) {
    res.status(500).json({
      message: `Error occured while creating user: ${e.message}`,
    });
  }
};
