const { Client } = require("pg");
const client = new Client(process.env.DATABASE_URL);
// SET TIME ZONE 'Asia/Kolkata';
const connectToClient = async () => {
  try {
    await client.connect();
    if (process.env.NEW_DATABASE === "true") {
      console.log("==================================");
      console.log("WARNING!! DROPPING OLD DATABASE...");
      console.log("==================================");
    }
    const query = `
    ${process.env.NEW_DATABASE === "true" ? "DROP DATABASE IF EXISTS lms;" : ""}
   
    SET TIME ZONE 'America/Vancouver';
    CREATE DATABASE IF NOT EXISTS lms;
    Use lms;
    CREATE TABLE IF NOT EXISTS teachers (
        teacher_id varchar(255) PRIMARY KEY NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );
    CREATE TABLE IF NOT EXISTS students (
        student_id  varchar(255) PRIMARY KEY NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
        );
    CREATE TABLE IF NOT EXISTS classrooms (
        classroom_id  varchar(255) PRIMARY KEY NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        section VARCHAR(255),
        description VARCHAR(255),
        color VARCHAR(255),
        teacher_id varchar(255) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
        created_at TIMESTAMP DEFAULT NOW()
        );
    CREATE TABLE IF NOT EXISTS students_classrooms (
        student_id  varchar(255) NOT NULL UNIQUE,
        classroom_id  varchar(255) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
        created_at TIMESTAMP DEFAULT NOW()
        );
    CREATE TABLE IF NOT EXISTS notes (
        note_id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        classroom_id VARCHAR(255) NOT NULL, 
        type VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        body varchar(10485760),
        FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id),
        created_at TIMESTAMP DEFAULT NOW()
        );
    CREATE TABLE IF NOT EXISTS submissions (
        submission_id VARCHAR(255) PRIMARY KEY NOT NULL UNIQUE,
        note_id VARCHAR(255) NOT NULL,
        student_id VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        FOREIGN KEY (note_id) REFERENCES notes(note_id),
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        created_at TIMESTAMP DEFAULT NOW()
        );
        `;

    await client.query(query);
    console.log("Connected to database, you are good to go!");
  } catch (e) {
    console.log(e);
  }
};
connectToClient();

module.exports = client;
