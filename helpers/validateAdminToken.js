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

    const decodedToken = await auth.verifyIdToken(idToken);
    if (decodedToken.account_type !== "admin") {
      res.status(401).json({
        message: "Unauthorized request.",
      });
    }

    next();
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
