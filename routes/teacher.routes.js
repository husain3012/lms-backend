const express = require("express");
const router = express.Router();
const { getUsers, signup, login, addFakeUsers } = require("../controllers/teacher.controller");

router.get("/get_all_users", getUsers);

router.post("/signup", signup);
router.post("/login", login);
router.post("/add_fake_users", addFakeUsers);

module.exports = router;
