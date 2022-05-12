const client = require("../config/DB");
const { v4: uuidv4 } = require("uuid");

const getSubmitted = async (req, res, next) => {
  const { id } = req.params;
  const query = `select * from submissions where note_id = '${id}' and student_id = '${req.user.userId}' ORDER BY created_at DESC`;
  try {
    const result = await client.query(query);
    return res.json(result.rows);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Error" });
  }
};

const getAllSubmissionsForNote = async (req, res, next) => {
  if (req.user.userType !== "teacher") {
    return res.status(400).send({ message: "You cannot view submissions" });
  }
  const { id } = req.params;
  const querySubmissions = `select * from submissions where note_id = '${id}' ORDER BY created_at DESC`;
  const queryStudents = `select students.student_id, students.name as student_name, students.email as student_email from students_classrooms join students on students_classrooms.student_id = students.student_id where students_classrooms.classroom_id = (select classroom_id from notes where note_id = '${id}')`;

  try {
    const submissions = (await client.query(querySubmissions)).rows;
    const students = (await client.query(queryStudents)).rows;
    // group by students
    const studentSubmissions = [];
    students.forEach((student) => {
      const studentSubmissionsObj = {
        student_id: student.student_id,
        student_name: student.student_name,
        student_email: student.student_email,
        submissions: [],
      };
      submissions.forEach((submission) => {
        if (submission.student_id === student.student_id) {
          studentSubmissionsObj.submissions.push(submission);
        }
      });
      studentSubmissions.push(studentSubmissionsObj);
    });

    return res.json(studentSubmissions);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const postSubmission = async (req, res, next) => {
  if (req.user.userType !== "student") {
    return res.status(400).send({ message: "You cannot submit notes" });
  }
  const { id } = req.params;
  const { url } = req.body;
  const query = `insert into submissions(submission_id, note_id, student_id, url) values('${uuidv4()}', '${id}', '${req.user.userId}', '${url}')`;
  try {
    const result = await client.query(query);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

module.exports = { getSubmitted, getAllSubmissionsForNote, postSubmission };
