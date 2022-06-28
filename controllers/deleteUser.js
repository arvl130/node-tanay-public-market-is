const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();

module.exports = async (req, res) => {
  try {
    const uid = req.params.uid;

    if (!uid) {
      res.status(400).json({
        message: "Invalid or missing UID",
      });
    }

    const userRecord = await auth.deleteUser(uid);

    res.status(200).json({
      message: "Succesfully deleted user.",
      user: userRecord,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error occured while deleting user.",
    });
  }

  // .then((userRecord) => {
  //   console.log("userRecord:", userRecord);
  //   res.json({ message: "OK" });
  // })
  // .catch((error) => {
  //   console.log("Error while retrieving user:", error);
  //   res.json({ message: "Error" });
  // });
};
