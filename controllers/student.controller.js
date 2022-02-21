const client = require("../config/DB");
const { v4: uuidv4 } = require("uuid");
const { Encrypt, Decrypt } = require("../securityConfig/crypto");
const { getToken } = require("../securityConfig/jwt");
// dev
const { faker } = require("@faker-js/faker");

// ---
const getUsers = async (req, res, next) => {
  const query = `select * from students`;
  console.log(client);
  try {
    const result = await client.query(query);
    res.json(result.rows);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const queryStudent = `select * from students where email = '${email}'`;
  const queryTeacher = `select * from teachers where email = '${email}'`;
  try {
    const resultStudent = await client.query(queryStudent);
    const resultTeacher = await client.query(queryTeacher);
    if (resultStudent.rowCount > 0) {
      res.status(400).send({ message: "Email already used by a student" });
    } else if (resultTeacher.rowCount > 0) {
      res.status(400).send({ message: "Email already used by a teacher" });
    } else {
      const passwordEncrypted = await Encrypt(password);
      const query = `insert into students(student_id, name, email, password) values('${uuidv4()}', '${name}', '${email}', '${passwordEncrypted}')`;
      const result = await client.query(query);
      res.json(result);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: "Something went wrong!" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const query = `select * from students where email = '${email}'`;
  try {
    const result = await client.query(query);
    const user = result.rows[0];
    if (user) {
      const passwordDecrypted = await Decrypt(user.password);
      if (password === passwordDecrypted) {
        const token = await getToken({ userId: user.student_id, userType: "student" });
        res.cookie("token", token);
        const { student_id, name, email } = user;

        res.json({
          user: { student_id, name, email },
          type: "student",
          token: token,
          message: "Login Successful",
        });
      } else {
        res.status(400).send({ message: "Invalid Password" });
      }
    } else {
      res.status(400).send({ message: "Invalid Email" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

const addFakeUsers = async (req, res, next) => {
  const { number } = req.body;
  const query = `insert into students(student_id, name, email, password) values`;
  const values = [];
  const addedUsers = [];
  for (let i = 0; i < number; i++) {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = await Encrypt("admin");
    values.push(`('${uuidv4()}', '${name}', '${email}', '${password}')`);
    addedUsers.push({ name, email, password: "admin" });
  }
  const queryString = query + values.join(",");
  try {
    const result = await client.query(queryString);
    res.status(200).json(addedUsers);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" });
  }
};

module.exports = {
  getUsers,
  signup,
  login,
  addFakeUsers,
};
