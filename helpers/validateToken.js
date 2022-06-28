const { getAuth } = require("firebase-admin/auth");
const auth = getAuth();

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Missing token.");
    }

    const idToken = req.headers.authorization.split(" ")[1];

    if (!idToken) {
      throw new Error("Missing or invalid token.");
    }

    await auth.verifyIdToken(idToken);
    next();
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
