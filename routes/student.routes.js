const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { getUsers, signup, login, addFakeUsers, updateDetails } = require("../controllers/student.controller");

router.get("/get_all_users", getUsers);

router.post("/signup", signup);
router.post("/login", login);
router.post("/add_fake_users", addFakeUsers);
router.post("/update_details", authMiddleware, updateDetails);

module.exports = router;
