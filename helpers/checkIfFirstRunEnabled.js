/* Express bindings */
const express = require("express");
const router = express.Router();

/* Firestore */
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

module.exports = async (req, res, next) => {
  const firstRunDocument = await db
    .collection("tpmis_settings")
    .doc("firstRun")
    .get();

  if (!firstRunDocument.exists) {
    res.status(400).json({
      message: "Bad Request",
    });
    return;
  }

  next();
};
