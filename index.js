require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
}

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer to use S3 for storage
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + path.extname(file.originalname));
    },
  }),
});

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Endpoint to upload profile photo
app.post(
  "/api/upload",
  authenticateToken,
  upload.single("profile_photo"),
  async (req, res) => {
    const userId = req.user.userId;
    const profilePhotoUrl = req.file.location;

    try {
      await db.query(
        "UPDATE user_profile SET profile_photo = $1 WHERE user_id = $2",
        [profilePhotoUrl, userId]
      );
      res.status(200).json({
        message: "Profile photo updated successfully",
        profile_photo: profilePhotoUrl,
      });
    } catch (err) {
      console.error("Error uploading profile photo:", err);
      res.status(500).send("Server error");
    }
  }
);

// Endpoint to create a new activity
app.post("/api/activities", authenticateToken, async (req, res) => {
  const { title, act_desc, location, act_date, act_time, num_people } =
    req.body;
  const userId = req.user.userId;

  try {
    const result = await db.query(
      "INSERT INTO activity (title, act_desc, act_date, act_time, location, user_id_host, num_people) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, act_desc, act_date, act_time, location, userId, num_people]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating activity:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch all activities
app.get("/api/activities", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, up.profile_photo 
      FROM activity a 
      JOIN user_profile up ON a.user_id_host = up.user_id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to register a new user
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

// Endpoint to fetch activities by the logged-in user
app.get("/api/my-activities", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(
      "SELECT * FROM activity WHERE user_id_host = $1",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching user's activities:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to delete an activity
app.delete("/api/activities/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    // Check if the activity belongs to the logged-in user
    const activityResult = await db.query(
      "SELECT * FROM activity WHERE id = $1 AND user_id_host = $2",
      [id, userId]
    );

    if (activityResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Activity not found or not authorized" });
    }

    // Delete the activity
    await db.query("DELETE FROM activity WHERE id = $1", [id]);
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (err) {
    console.error("Error deleting activity:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to log in a user
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userResult = await db.query(
      "SELECT * FROM user_login WHERE username = $1",
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Include the username in the JWT payload
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token,
      username: user.username,
      email: user.email,
      id: user.id,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to get the user's profile
app.get("/api/profile/:userId?", authenticateToken, async (req, res) => {
  const userId = req.params.userId || req.user.userId;

  try {
    const profileResult = await db.query(
      "SELECT * FROM user_profile WHERE user_id = $1",
      [userId]
    );
    const profile = profileResult.rows[0];

    const userResult = await db.query(
      "SELECT * FROM user_login WHERE id = $1",
      [userId]
    );
    const user = userResult.rows[0];

    res.json({
      real_name: profile.real_name,
      username: user.username,
      email: user.email,
      social_media: profile.social_media,
      dob: profile.birthdate,
      description: profile.user_desc,
      profile_photo: profile.profile_photo,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch a user's profile by their ID
app.get("/api/profile/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const profileResult = await db.query(
      "SELECT * FROM user_profile WHERE user_id = $1",
      [userId]
    );
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const profile = profileResult.rows[0];

    const userResult = await db.query(
      "SELECT * FROM user_login WHERE id = $1",
      [userId]
    );
    const user = userResult.rows[0];

    res.json({
      real_name: profile.real_name,
      username: user.username,
      email: user.email,
      social_media: profile.social_media,
      dob: profile.birthdate,
      description: profile.user_desc,
      profile_photo: profile.profile_photo,
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint for updating user profile
app.put("/api/profile", authenticateToken, async (req, res) => {
  const { real_name, social_media, dob, description, profile_photo } = req.body;

  try {
    const userId = req.user.userId;

    // Update user_profile table with the provided fields
    await db.query(
      "UPDATE user_profile SET real_name = $1, social_media = $2, birthdate = $3, user_desc = $4 WHERE user_id = $5",
      [real_name, social_media, dob, description, userId]
    );

    // Check if profile_photo is provided and update it if needed
    if (profile_photo) {
      await db.query(
        "UPDATE user_profile SET profile_photo = $1 WHERE user_id = $2",
        [profile_photo, userId]
      );
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to get the current user's details including username and email
app.get("/api/user-details", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch current user's username and email
    const userResult = await db.query(
      "SELECT username, email FROM user_login WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch host's username and email based on activity's user_id_host
app.get(
  "/api/activity-host/:activityId",
  authenticateToken,
  async (req, res) => {
    try {
      const { activityId } = req.params;

      // Fetch activity details including host's user_id_host
      const activityResult = await db.query(
        "SELECT ul.username AS host_username, ul.email AS host_email " +
          "FROM activity a " +
          "JOIN user_login ul ON a.user_id_host = ul.id " +
          "WHERE a.id = $1",
        [activityId]
      );

      if (activityResult.rows.length === 0) {
        return res.status(404).json({ error: "Activity not found" });
      }

      const activity = activityResult.rows[0];
      res.json({
        host_username: activity.host_username,
        host_email: activity.host_email,
      });
    } catch (err) {
      console.error("Error fetching host details:", err);
      res.status(500).send("Server error");
    }
  }
);

// Endpoint to fetch all users (usernames  and ids)
app.get("/api/users", async (req, res) => {
  try {
    const result = await db.query("SELECT id, username FROM user_login");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to update an activity
app.put("/api/activities/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, act_desc, location, act_date, act_time } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the activity belongs to the logged-in user
    const activityResult = await db.query(
      "SELECT * FROM activity WHERE id = $1 AND user_id_host = $2",
      [id, userId]
    );

    if (activityResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Activity not found or not authorized" });
    }

    // Update the activity
    await db.query(
      "UPDATE activity SET title = $1, act_desc = $2, location = $3, act_date = $4, act_time = $5 WHERE id = $6",
      [title, act_desc, location, act_date, act_time, id]
    );

    res.status(200).json({ message: "Activity updated successfully" });
  } catch (err) {
    console.error("Error updating activity:", err);
    res.status(500).send("Server error");
  }
});

// Comments endpoints

// Create a new comment
app.post("/api/comments", authenticateToken, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    const result = await db.query(
      "INSERT INTO comments (user_id, content) VALUES ($1, $2) RETURNING *",
      [userId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).send("Server error");
  }
});

// Create a reply to a comment
app.post(
  "/api/comments/:commentId/replies",
  authenticateToken,
  async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    try {
      const result = await db.query(
        "INSERT INTO replies (comment_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
        [commentId, userId, content]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Error creating reply:", err);
      res.status(500).send("Server error");
    }
  }
);

// Get all comments with their replies
app.get("/api/comments", async (req, res) => {
  try {
    const commentsResult = await db.query(
      "SELECT c.id, c.content, c.created_at, u.username FROM comments c JOIN user_login u ON c.user_id = u.id ORDER BY c.created_at DESC"
    );

    const comments = commentsResult.rows;

    for (let comment of comments) {
      const repliesResult = await db.query(
        "SELECT r.id, r.content, r.created_at, u.username FROM replies r JOIN user_login u ON r.user_id = u.id WHERE r.comment_id = $1 ORDER BY r.created_at ASC",
        [comment.id]
      );
      comment.replies = repliesResult.rows;
    }

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch join requests for the host
app.get("/api/join-requests", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await db.query(
      `SELECT jr.id, jr.activity_id, jr.requester_id, ul.username, up.profile_photo, a.title AS activity_title
       FROM join_requests jr
       JOIN user_login ul ON jr.requester_id = ul.id
       JOIN user_profile up ON ul.id = up.user_id
       JOIN activity a ON jr.activity_id = a.id
       WHERE a.user_id_host = $1 AND jr.status = 'pending'`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching join requests:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to create a join request
app.post("/api/join-requests", authenticateToken, async (req, res) => {
  const { activity_id } = req.body;
  const requester_id = req.user.userId;

  try {
    await db.query(
      "INSERT INTO join_requests (activity_id, requester_id) VALUES ($1, $2)",
      [activity_id, requester_id]
    );

    res.status(201).json({ message: "Join request sent successfully" });
  } catch (err) {
    console.error("Error creating join request:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to update join request status
app.put("/api/join-request/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.query(
      "UPDATE join_requests SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating join request:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch pending join requests for the current user
app.get(
  "/api/user-pending-requests/:userId",
  authenticateToken,
  async (req, res) => {
    const userId = req.params.userId;

    try {
      const result = await db.query(
        `SELECT jr.id, jr.activity_id, jr.requester_id, jr.status, a.title AS activity_title
       FROM join_requests jr
       JOIN activity a ON jr.activity_id = a.id
       WHERE jr.requester_id = $1 AND jr.status = 'pending'`,
        [userId]
      );
      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      res.status(500).send("Server error");
    }
  }
);

// Accept Join Request Endpoint
app.post(
  "/api/join-requests/:id/accept",
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      const requestResult = await db.query(
        "SELECT * FROM join_requests WHERE id = $1",
        [id]
      );
      if (requestResult.rows.length === 0) {
        return res.status(404).json({ error: "Join request not found" });
      }

      const request = requestResult.rows[0];
      const { activity_id, requester_id } = request;

      // Increment num_people_joined in activity table
      await db.query(
        "UPDATE activity SET num_people_joined = num_people_joined + 1 WHERE id = $1",
        [activity_id]
      );

      // Update user's activity slots
      const slotsResult = await db.query(
        "SELECT activity_slot_1, activity_slot_2, activity_slot_3, activity_slot_4, activity_slot_5, activity_slot_6, activity_slot_7, activity_slot_8, activity_slot_9, activity_slot_10 FROM user_profile WHERE user_id = $1",
        [requester_id]
      );

      const slots = slotsResult.rows[0];
      let updated = false;
      for (let i = 1; i <= 10; i++) {
        if (slots[`activity_slot_${i}`] === null) {
          await db.query(
            `UPDATE user_profile SET activity_slot_${i} = $1, activities_joined = activities_joined + 1 WHERE user_id = $2`,
            [activity_id, requester_id]
          );
          updated = true;
          break;
        }
      }

      if (!updated) {
        return res
          .status(400)
          .json({ error: "User has joined too many activities" });
      }

      // Remove join request
      await db.query("DELETE FROM join_requests WHERE id = $1", [id]);

      res.status(200).json({ message: "Join request accepted" });
    } catch (err) {
      console.error("Error accepting join request:", err);
      res.status(500).send("Server error");
    }
  }
);

// Reject Join Request Endpoint
app.post(
  "/api/join-requests/:id/reject",
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await db.query(
        "DELETE FROM join_requests WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Join request not found" });
      }

      res.status(200).json({ message: "Join request rejected" });
    } catch (err) {
      console.error("Error rejecting join request:", err);
      res.status(500).send("Server error");
    }
  }
);

// Endpoint to fetch user activity slots
app.get(
  "/api/user-activity-slots/:userId",
  authenticateToken,
  async (req, res) => {
    const { userId } = req.params;

    try {
      const result = await db.query(
        "SELECT activity_slot_1, activity_slot_2, activity_slot_3, activity_slot_4, activity_slot_5, activity_slot_6, activity_slot_7, activity_slot_8, activity_slot_9, activity_slot_10 FROM user_profile WHERE user_id = $1",
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "User profile not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Error fetching user activity slots:", err);
      res.status(500).send("Server error");
    }
  }
);

//Endpoint to fetch user that has joined the activity
app.get(
  "/api/activity-users/:activityId",
  authenticateToken,
  async (req, res) => {
    const { activityId } = req.params;
    try {
      const result = await db.query(
        `
      SELECT ul.id, ul.username, up.profile_photo
      FROM user_login ul
      JOIN user_profile up ON ul.id = up.user_id
      WHERE $1 = ANY(array[up.activity_slot_1, up.activity_slot_2, up.activity_slot_3, 
                           up.activity_slot_4, up.activity_slot_5, up.activity_slot_6, 
                           up.activity_slot_7, up.activity_slot_8, up.activity_slot_9, 
                           up.activity_slot_10])`,
        [activityId]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Server error");
    }
  }
);

// Endpoint to remove a user from an activity
app.delete(
  "/api/remove-user/:activityId/:userId",
  authenticateToken,
  async (req, res) => {
    const activityId = parseInt(req.params.activityId, 10); // Convert activityId to integer
    const { userId } = req.params;

    try {
      await db.query("BEGIN");

      // Decrement the number of people joined
      await db.query(
        "UPDATE activity SET num_people_joined = num_people_joined - 1 WHERE id = $1",
        [activityId]
      );

      // Fetch the user's profile
      const userProfileResult = await db.query(
        "SELECT * FROM user_profile WHERE user_id = $1",
        [userId]
      );
      const userProfile = userProfileResult.rows[0];

      // Find the activity slot containing the activity ID and set it to NULL
      const updatedSlots = Object.keys(userProfile)
        .filter((key) => key.startsWith("activity_slot_"))
        .reduce((acc, key) => {
          acc[key] = userProfile[key] === activityId ? null : userProfile[key];
          return acc;
        }, {});

      // Update the user's activity slots in the database
      for (const [key, value] of Object.entries(updatedSlots)) {
        if (value === null) {
          const query = `UPDATE user_profile SET ${key} = NULL WHERE user_id = $1`;
          await db.query(query, [userId]);
        } else {
          const query = `UPDATE user_profile SET ${key} = $1 WHERE user_id = $2`;
          await db.query(query, [value, userId]);
        }
      }

      await db.query(
        "UPDATE user_profile SET activities_joined = activities_joined - 1 WHERE user_id = $1",
        [userId]
      );

      await db.query("COMMIT");

      res.status(200).json({ message: "User removed successfully" });
    } catch (err) {
      await db.query("ROLLBACK");
      console.error("Error removing user:", err);
      res.status(500).send("Server error");
    }
  }
);

// Endpoint to fetch all users excluding the current user
app.get("/api/users", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await db.query(
      "SELECT username, profile_photo FROM user_profile WHERE user_id != $1",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint for sending a message
app.post("/api/messages", authenticateToken, async (req, res) => {
  const { to, content } = req.body;
  const from = req.user.userId;

  try {
    const result = await db.query(
      "INSERT INTO messages (from_user, to_user, content, timestamp) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
      [from, to, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint for fetching messages
app.get("/api/messages/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const currentUser = req.user.userId;

  try {
    const result = await db.query(
      "SELECT * FROM messages WHERE (from_user = $1 AND to_user = $2) OR (from_user = $2 AND to_user = $1) ORDER BY timestamp",
      [parseInt(currentUser, 10), parseInt(userId, 10)]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send("Server error");
  }
});

// Endpoint to fetch users with whom the current user has chat history
app.get("/api/chat-users", authenticateToken, async (req, res) => {
  const currentUserId = req.user.userId;
  const targetUserId = req.query.targetUserId;

  try {
    let result = await db.query(
      `SELECT DISTINCT u.id, u.username, up.profile_photo 
       FROM user_login u 
       INNER JOIN user_profile up ON u.id = up.user_id 
       INNER JOIN messages m ON u.id = m.from_user OR u.id = m.to_user 
       WHERE (m.from_user = $1 OR m.to_user = $1) AND u.id != $1`,
      [currentUserId]
    );

    if (targetUserId) {
      const targetUserResult = await db.query(
        `SELECT u.id, u.username, up.profile_photo 
         FROM user_login u 
         INNER JOIN user_profile up ON u.id = up.user_id 
         WHERE u.id = $1`,
        [targetUserId]
      );

      if (targetUserResult.rows.length > 0 && !result.rows.some(user => user.id === parseInt(targetUserId))) {
        result.rows.push(targetUserResult.rows[0]);
      }
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching chat users:", err);
    res.status(500).send("Server error");
  }
});


// Serve the React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
