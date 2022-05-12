const express = require("express");
const { getAllSubmissionsForNote, getSubmitted, postSubmission } = require("../controllers/submissions.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/submit/:id", authMiddleware, postSubmission);
router.get("/get_my_submissions/:id", authMiddleware, getSubmitted);
router.get("/getAll/:id", authMiddleware, getAllSubmissionsForNote);

module.exports = router;
