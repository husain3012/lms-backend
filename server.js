require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const teacherRouter = require("./routes/teacher.routes");
const studentRouter = require("./routes/student.routes");
const classroomRouter = require("./routes/classroom.routes");
const notesRouter = require("./routes/notes.routes");
const submissionsRouter = require("./routes/submissions.routes");
const cors = require("cors");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}
// access control origin
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  return res.send("Server is running!");
});

// routes
app.use("/api/teacher", teacherRouter);
app.use("/api/classroom", classroomRouter);
app.use("/api/student", studentRouter);
app.use("/api/notes", notesRouter);
app.use("/api/submissions", submissionsRouter);
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
