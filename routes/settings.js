/* Express bindings */
const express = require("express");
const router = express.Router();

const checkIfFirstRunEnabled = require("../helpers/checkIfFirstRunEnabled");
const createAdminUser = require("../controllers/createAdminUser");
const issuePayment = require("../helpers/issuePayment/issuePayment");
const issuePaymentSingle = require("../helpers/issuePayment/issuePaymentSingle");
const verifyAdminToken = require("../helpers/validateAdminToken");

router.post(
  "/firstrun/create-admin-user",
  checkIfFirstRunEnabled,
  createAdminUser
);

router.get(
  "/firstrun/create-payments",
  checkIfFirstRunEnabled,
  async (req, res) => {
    try {
      await issuePayment();
      res.status(200).json({
        message: "Payments triggered.",
      });
    } catch (e) {
      res.status(500).json({
        message: "Error occured while trigerring payments.",
      });
    }
  }
);

router.post(
  "/firstrun/create-payments/:id",
  checkIfFirstRunEnabled,
  verifyAdminToken,
  async (req, res) => {
    try {
      const tenant_uid = req.params.id;
      if (!tenant_uid) {
        res.status(400).json({
          message: "Invalid or missing UID.",
        });
        return;
      }

      await issuePaymentSingle(tenant_uid);
      res.status(200).json({
        message: "Payments triggered.",
      });
    } catch (e) {
      res.status(500).json({
        message: "Error occured while trigerring payments.",
      });
    }
  }
);

module.exports = router;
