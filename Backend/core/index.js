// backend/index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/register", async (req, res) => {
  const { email, fullname, username, password } = req.body;

  try {
    await db.query("BEGIN");

    const passwordHash = await bcrypt.hash(password, 10);

    const userLoginResult = await db.query(
      "INSERT INTO user_login (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [email, username, passwordHash]
    );
    const userId = userLoginResult.rows[0].id;

    await db.query(
      "INSERT INTO user_profile (user_id, real_name) VALUES ($1, $2)",
      [userId, fullname]
    );

    await db.query("COMMIT");

    res.json({ message: "Registration successful" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error during registration:", err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
