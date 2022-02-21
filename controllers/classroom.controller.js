const client = require("../config/DB");
const { v4: uuidv4 } = require("uuid");

const getClassroomById = async (req, res, next) => {
  const { classroom_id } = req.params;
  const query = `select * from classrooms where classroom_id = '${classroom_id}'`;
  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const createClassroom = async (req, res, next) => {
  const { name, description } = req.body;
  if (req.user.userType !== "teacher") {
    return res.status(400).send({ message: "You are not authorized to create a classroom" });
  }
  const query = `insert into classrooms(classroom_id, name,description, teacher_id) values('${uuidv4()}', '${name}',${description}', '${req.user.userId}')`;
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

  const query = `select * from classrooms where teacher_id = '${req.user.userId}'`;

  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const joinClassroom = async (req, res, next) => {
  if (req.user.userType !== "student") {
    return res.status(400).send({ message: "You cannot join a classroom" });
  }
  const { classroom_id } = req.body;
  const query = `insert into classroom_students(classroom_id, student_id) values('${classroom_id}', '${req.user.userId}')`;
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
  const query = `select * from classrooms where classroom_id in (select classroom_id from classroom_students where student_id = '${req.user.userId}')`;
  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

module.exports = { getClassroomById, createClassroom, getCreatedClassrooms, joinClassroom, getJoinedClassrooms };
