require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const teacherRouter = require("./routes/teacher.routes");
const studentRouter = require("./routes/student.routes");
const classroomRouter = require("./routes/classroom.routes");
const notesRouter = require("./routes/notes.routes");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// routes
app.use("/api/teacher", teacherRouter);
app.use("/api/classroom", classroomRouter);
app.use("/api/student", studentRouter);
app.use("/api/notes", notesRouter);
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
