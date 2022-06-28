/* Express bindings */
const express = require("express");
const router = express.Router();

/* Helper scripts */
const validateToken = require("../helpers/validateToken");
const validateAdminToken = require("../helpers/validateAdminToken");

/* Controllers */
// const getUser = require("../controllers/getUser");
// const getAllUsers = require("../controllers/getAllUsers");
// const deleteUser = require("../controllers/deleteUser");
// const createUser = require("../controllers/createUser");
const getAllTenantUsers = require("../controllers/getAllTenantUsers");
const getTenant = require("../controllers/getTenant");
const createTenant = require("../controllers/createTenant");
const deleteTenant = require("../controllers/deleteTenant");
const updateTenant = require("../controllers/updateTenant");
const changeTenantPassword = require("../controllers/changeTenantPassword");

/* Routes */
router.get("/tenants", validateToken, getAllTenantUsers);
router.get("/tenants/:uid", validateToken, getTenant);
router.put("/tenants", validateAdminToken, createTenant);
router.delete("/tenants/:uid", validateAdminToken, deleteTenant);
router.patch("/tenants/:uid", validateAdminToken, updateTenant);
router.patch("/tenants/:uid/pwreset", validateAdminToken, changeTenantPassword);
// router.get("/", validateToken, getAllUsers);
// router.get("/:uid", validateToken, getUser);
// router.put("/", validateAdminToken, createUser);
// router.delete("/:uid", validateAdminToken, deleteUser);
//router.patch("/:uid", validateAdminToken, updateUser);

module.exports = router;
