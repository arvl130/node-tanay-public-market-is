const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const db = getFirestore();
const auth = getAuth();

module.exports = async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    res.status(400).json({
      message: "Invalid or missing username.",
    });
    return;
  }

  if (!password) {
    res.status(400).json({
      message: "Invalid or missing password.",
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      message: "Password should be at least 8 characters.",
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

  const userRecord = await auth.createUser({
    email,
    password,
  });

  const uid = userRecord.uid;

  await auth.setCustomUserClaims(uid, {
    account_type: "admin",
  });

  await db.collection("tpmis_users").doc(uid).set({
    account_type: "admin",
  });

  res.status(200).json({
    message: "User created.",
    user: userRecord,
  });
};
