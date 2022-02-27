const express = require("express");
const { getClassroomById, getJoinedClassrooms, getCreatedClassrooms, createClassroom, joinClassroom, getJoinedStudents, leaveClassroom, kickFromClassroom, deleteClassroom } = require("../controllers/classroom.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/joined", authMiddleware, getJoinedClassrooms);
router.get("/created", authMiddleware, getCreatedClassrooms);
router.get("/students/:classroom_id", authMiddleware, getJoinedStudents);
router.get("/:id", authMiddleware, getClassroomById);
router.post("/create", authMiddleware, createClassroom);
router.post("/join", authMiddleware, joinClassroom);
router.post("/leave", authMiddleware, leaveClassroom);
router.post("/kick", authMiddleware, kickFromClassroom);
router.delete("/:classroom_id", authMiddleware, deleteClassroom);

module.exports = router;
