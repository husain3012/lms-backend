const client = require("../config/DB");
const short_uuid = require("short-uuid");
const { v4: uuidv4 } = require("uuid");

const uuidTranslator = short_uuid();
uuidTranslator.maxLength = 10;

const getClassroomById = async (req, res, next) => {
  const { classroom_id } = req.params;
  const query = `select * from classrooms where classroom_id = '${classroom_id}'`;

  try {
    const result = await client.query(query);
    console.log(result.rows);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const getJoinedStudents = async (req, res, next) => {
  const { classroom_id } = req.params;
  const query = `select students.name as student_name, students.email as student_email from students_classrooms inner join students on students_classrooms.student_id = students.student_id where classroom_id = '${classroom_id}'`;
  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const createClassroom = async (req, res, next) => {
  const { name, description, section } = req.body;
  if (req.user.userType !== "teacher") {
    return res.status(400).send({ message: "You are not authorized to create a classroom" });
  }
  const query = `insert into classrooms(classroom_id, name,description, section, teacher_id) values('${uuidv4()}', '${name}','${description}', '${section}', '${req.user.userId}')`;
  try {
    const result = await client.query(query);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const getCreatedClassrooms = async (req, res, next) => {
  if (req.user.userType !== "teacher") {
    return res.status(400).send({ message: "You cannot get created classrooms" });
  }

  const query = `select classrooms.* from classrooms inner join teachers on classrooms.teacher_id = teachers.teacher_id where classrooms.teacher_id = '${req.user.userId}'`;
  // get created classrooms with number of students erolled
  // const query = `select classrooms.*, count(students_classrooms.student_id) as students_count from classrooms inner join teachers on classrooms.teacher_id = teachers.teacher_id inner join students_classrooms on classrooms.classroom_id = students_classrooms.classroom_id where classrooms.teacher_id = '${req.user.userId}' group by classrooms.classroom_id`;
  // get created classrooms with number of students enrolled in each classroom group by classroom_id
  //const query = `select classrooms.*, teachers.name as teacher_name, teachers.email as teacher_email, count(students_classrooms.student_id) as students_count from classrooms inner join teachers on classrooms.teacher_id = teachers.teacher_id inner join students_classrooms on classrooms.classroom_id = students_classrooms.classroom_id where classrooms.teacher_id = '${req.user.userId}' group by classrooms.classroom_id`;

  try {
    const result = await client.query(query);
    console.log(result.rows);
    console.log(result.rows);
    const transformedData = result.rows.map((row) => {
      return {
        ...row,
        short_id: uuidTranslator.fromUUID(row.classroom_id, (length = 6)),
      };
    });
    // console.log(transformedData);
    res.json(transformedData);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const joinClassroom = async (req, res, next) => {
  if (req.user.userType !== "student") {
    return res.status(400).send({ message: "You cannot join a classroom" });
  }
  const { short_classroom_code } = req.body;
  const classroom_id = uuidTranslator.toUUID(short_classroom_code);

  const query = `insert into students_classrooms(classroom_id, student_id) values('${classroom_id}', '${req.user.userId}')`;
  try {
    const result = await client.query(query);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const getJoinedClassrooms = async (req, res, next) => {
  if (req.user.userType !== "student") {
    return res.status(400).send({ message: "You cannot get joined classrooms" });
  }
  const query = `select classrooms.*, teachers.name as teacher_name, teachers.email as teacher_email from classrooms inner join teachers on classrooms.teacher_id = teachers.teacher_id inner join students_classrooms on classrooms.classroom_id = students_classrooms.classroom_id where students_classrooms.student_id = '${req.user.userId}'`;
  try {
    const result = await client.query(query);
    // console.log(result.rows);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

module.exports = { getClassroomById, createClassroom, getCreatedClassrooms, joinClassroom, getJoinedClassrooms, getJoinedStudents };
