// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing

const app = express();
const PORT = 8080; // You can change this to any available port

app.use(cors());
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
    const { email, fullname, username, password } = req.body;

    try {
        // Start a transaction
        await db.query('BEGIN');

        // Hash the password before storing it
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert into user_login and get the inserted id
        const userLoginResult = await db.query(
            'INSERT INTO user_login (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id',
            [email, username, passwordHash]
        );
        const userId = userLoginResult.rows[0].id;

        // Insert into user_profile using the obtained user_id
        await db.query(
            'INSERT INTO user_profile (user_id, real_name) VALUES ($1, $2)',
            [userId, fullname]
        );

        // Commit the transaction
        await db.query('COMMIT');

        res.json({ message: 'Registration successful' });
    } catch (err) {
        // Rollback the transaction in case of error
        await db.query('ROLLBACK');
        console.error('Error during registration:', err);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
