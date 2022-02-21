const express = require("express");
const { post_notes, get_notes } = require("../controllers/notes.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/post_notes/:classroom_id", authMiddleware, post_notes);
router.get("/get_notes/:classroom_id", authMiddleware, get_notes);

module.exports = router;
