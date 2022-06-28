const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();

module.exports = async (req, res) => {
  try {
    const uid = req.params.uid;
    const newPassword = req.body.newPassword;

    if (!uid) {
      res.status(400).json({
        message: "Invalid or missing UID",
      });
      return;
    }

    if (!newPassword) {
      res.status(400).json({
        message: "Invalid or missing password",
      });
      return;
    }

    const userRecord = await auth.updateUser(uid, {
      password: newPassword,
    });

    res.status(200).json({
      message: "Password updated.",
      user: userRecord,
    });
  } catch (e) {
    res.status(500).json({
      message: `Error occured while updating user: ${e.message}`,
    });
  }
};
