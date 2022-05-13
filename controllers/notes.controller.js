const client = require("../config/DB");
const { v4: uuidv4 } = require("uuid");

const post_notes = async (req, res, next) => {
  const { type, body, title } = req.body;
  const classroom_id = req.params.classroom_id;
  const query = `insert into notes(note_id,classroom_id, type, title, body) values('${uuidv4()}', '${classroom_id}','${type}', '${title}', '${body}')`;
  try {
    const result = await client.query(query);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const get_notes = async (req, res, next) => {
  const { type, body } = req.body;
  const classroom_id = req.params.classroom_id;
  const query = `select * from notes where classroom_id = '${classroom_id}' ORDER BY created_at DESC`;
  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const getNoteById = async (req, res, next) => {
  const { id } = req.params;
  const query = `select *, classrooms.classroom_id, classrooms.name as classroom_name, classrooms.color as classroom_color, teachers.name as teacher_name, teachers.email as teacher_email from notes inner join classrooms on notes.classroom_id = classrooms.classroom_id inner join teachers on classrooms.teacher_id = teachers.teacher_id where note_id = '${id}'`;

  try {
    const note = (await client.query(query)).rows[0];
    return res.json(note);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

module.exports = { post_notes, get_notes, getNoteById };
