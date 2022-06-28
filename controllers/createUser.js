const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();

module.exports = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

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

    const userRecord = await auth.createUser({
      email: `${username}@noemail.com`,
      emailVerified: false,
      password,
      displayName: "",
      disabled: false,
    });
    res.status(200).json({
      message: "Succesfully created user.",
      user: userRecord,
    });
  } catch (e) {
    res.status(500).json({
      message: `Error occured while creating user: ${e.message}`,
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
