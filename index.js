require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db'); 
const path = require("path");
const bcrypt = require('bcryptjs'); // Using bcryptjs
const jwt = require('jsonwebtoken'); // For token-based authentication

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
}

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        return res.sendStatus(401); // No token provided
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Invalid token
        }
        req.user = user;
        next();
    });
};

// User registration endpoint
app.post('/api/register', async (req, res) => {
    const { email, fullname, username, password } = req.body;

    try {
        await db.query('BEGIN');

        // Hash the password before storing it
        const passwordHash = await bcrypt.hash(password, 10);

        const userLoginResult = await db.query(
            'INSERT INTO user_login (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id',
            [email, username, passwordHash]
        );
        const userId = userLoginResult.rows[0].id;

        await db.query(
            'INSERT INTO user_profile (user_id, real_name) VALUES ($1, $2)',
            [userId, fullname]
        );

        await db.query('COMMIT');

        res.json({ message: 'Registration successful' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Error during registration:', err);
        res.status(500).send('Server error');
    }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await db.query('SELECT * FROM user_login WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = userResult.rows[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Server error');
    }
});

// Get user profile endpoint
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const profileResult = await db.query('SELECT * FROM user_profile WHERE user_id = $1', [userId]);
        const profile = profileResult.rows[0];

        const userResult = await db.query('SELECT * FROM user_login WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        res.json({
            real_name: profile.real_name,
            username: user.username,
            social_media: profile.social_media,
            dob: profile.dob,
            description: profile.description
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).send('Server error');
    }
});

// Update user profile endpoint
app.put('/api/profile', authenticateToken, async (req, res) => {
    const { real_name, social_media, dob, description } = req.body;

    try {
        const userId = req.user.userId;

        await db.query(
            'UPDATE user_profile SET real_name = $1, social_media = $2, dob = $3, description = $4 WHERE user_id = $5',
            [real_name, social_media, dob, description, userId]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).send('Server error');
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
