const client = require("../config/DB");
const { v4: uuidv4 } = require("uuid");

const post_notes = async (req, res, next) => {
    const { type, body } = req.body;
    const classroom_id = req.params.classroom_id;
    const query = `insert into notes(notes_id,classroom_id,type,body) values('${uuidv4()}', '${classroom_id}','${type}','${body}')`;
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
    const query = `select * from notes where classroom_id = '${classroom_id}'`;
    try {
        const result = await client.query(query);
        res.json(result.rows);
    } catch (e) {
        console.log(e);
        res.status(400).json({ message: "Error" });
    }
};

module.exports = { post_notes, get_notes };
