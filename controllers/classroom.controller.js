const client = require("../config/DB");
const short_uuid = require("short-uuid");
const { v4: uuidv4 } = require("uuid");

const uuidTranslator = short_uuid();
uuidTranslator.maxLength = 10;

const getClassroomById = async (req, res, next) => {
  const { id } = req.params;

  const query = `select * from classrooms where classroom_id = '${id}'`;

  try {
    const result = await client.query(query);
    const classroom = result.rows[0];
    classroom.short_id = uuidTranslator.fromUUID(classroom.classroom_id, (length = 6));
    res.json(classroom);
  } catch (e) {
    res.status(400).json({ message: "Error" });
  }
};

const getJoinedStudents = async (req, res, next) => {
  const { classroom_id } = req.params;
  const query = `select students.name as student_name, students.email as student_email, students_classrooms.created_at as joined_on  from students_classrooms inner join students on students_classrooms.student_id = students.student_id where classroom_id = '${classroom_id}' ORDER BY student_name ASC`;
  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (e) {
    res.status(400).json({ message: "Error" });
  }
};

const createClassroom = async (req, res, next) => {
  const { name, description, section, color } = req.body;
  // sanitize data
  const sanitizedName = name.replace(/'/g, "''");
  const sanitizedDescription = description.replace(/'/g, "''");
  const sanitizedSection = section.replace(/'/g, "''");
  const sanitizedColor = color.replace(/'/g, "''");

  if (req.user.userType !== "teacher") {
    return res.status(400).send({ message: "You are not authorized to create a classroom" });
  }
  const query = `insert into classrooms(classroom_id, name, description, color, section, teacher_id) values('${uuidv4()}', '${sanitizedName}','${sanitizedDescription}', '${sanitizedColor}', '${sanitizedSection}', '${req.user.userId}')`;
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

  try {
    const result = await client.query(query);
    const transformedData = result.rows.map((row) => {
      return {
        ...row,
        short_id: uuidTranslator.fromUUID(row.classroom_id, (length = 6)),
      };
    });
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

const leaveClassroom = async (req, res, next) => {
  if (req.user.userType !== "student") {
    return res.status(400).send({ message: "You cannot leave a classroom" });
  }
  const { classroom_id } = req.body;
  const student_id = req.user.userId;
  const query = `delete from students_classrooms where student_id = '${student_id}' AND classroom_id = '${classroom_id}'`;

  try {
    const result = await client.query(query);
    console.log(result.rows);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const kickFromClassroom = async (req, res, next) => {
  if (req.user.userType !== "teacher") {
    return res.status(400).send({ message: "You cannot kick students from classroom" });
  }
  const { classroom_id, email } = req.body;
  const query = `select * from students where email ='${email}' `;
  try {
    const result = await client.query(query);
    const student_id = result.rows[0].student_id;
    const kickQuery = `delete from students_classrooms where student_id = '${student_id}' AND classroom_id = '${classroom_id}'`;
    const kickResult = await client.query(kickQuery);
    console.log(kickResult.rows);
    res.json(kickResult.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const deleteClassroom = async (req, res, next) => {
  if (req.user.userType !== "teacher") {
    return res.status(400).send({ message: "You cannot delete a classroom" });
  }
  const { id } = req.params;
  const query1 = `delete from students_classrooms where classroom_id = '${id}'`;
  const query2 = `delete from notes where classroom_id = '${id}'`;
  const query3 = `delete from classrooms where classroom_id = '${id}'`;

  try {
    const result1 = await client.query(query1);
    const result2 = await client.query(query2);
    const result3 = await client.query(query3);
    const data = {
      classroom: result1.rows,
      students_classrooms: result2.rows,
      notes: result3.rows,
    };

    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};



module.exports = { getClassroomById, createClassroom, getCreatedClassrooms, joinClassroom, getJoinedClassrooms, getJoinedStudents, leaveClassroom, kickFromClassroom, deleteClassroom };
