const express = require("express");
const { getClassroomById, getJoinedClassrooms, getCreatedClassrooms, createClassroom, joinClassroom } = require("../controllers/classroom.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/:id", authMiddleware, getClassroomById);
router.get("/joined", authMiddleware, getJoinedClassrooms);
router.get("/created", authMiddleware, getCreatedClassrooms);
router.post("/create", authMiddleware, createClassroom);
router.post("/join", authMiddleware, joinClassroom);

module.exports = router;
