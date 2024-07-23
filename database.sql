CREATE TABLE user_login(
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE,
	username TEXT,
	password_hash TEXT
);

CREATE TABLE user_profile(
	id SERIAL PRIMARY KEY,
	user_id INT,
	FOREIGN KEY (user_id) REFERENCES user_login(id),
	real_name TEXT,
	user_desc VARCHAR(255),
	social_media TEXT,
	birthdate TIMESTAMP WITHOUT TIME ZONE,
	profile_photo TEXT,
	activity_slot_1 INT,
	activity_slot_2 INT,
 	activity_slot_3 INT,
 	activity_slot_4 INT,
 	activity_slot_5 INT,
 	activity_slot_6 INT,
 	activity_slot_7 INT,
 	activity_slot_8 INT,
 	activity_slot_9 INT,
 	activity_slot_10 INT,
	activities_joined INT DEFAULT 0
);

CREATE TABLE activity(
	id SERIAL PRIMARY KEY,
	title TEXT,
	user_id_host INT,
	FOREIGN KEY (user_id_host) REFERENCES user_login(id),
	act_desc VARCHAR(255),
	act_date DATE,
	location TEXT,
	act_time TIME WITHOUT TIME ZONE,
	num_people INT,
	num_people_joined INT DEFAULT 0;
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user_login(id),
    content TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE replies (
    id SERIAL PRIMARY KEY,
    comment_id INT,
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES user_login(id),
    content TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE join_requests (
  id SERIAL PRIMARY KEY,
  activity_id INT,
  requester_id INT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (activity_id) REFERENCES activity(id),
  FOREIGN KEY (requester_id) REFERENCES user_login(id)
);

CREATE TABLE messages (
	id SERIAL PRIMARY KEY,
	from_user INT,
	to_user INT,
	content TEXT,
	timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES user_login(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL
);

// this is db, very latest, but yeah just for a pinpoint lol (can delete it later)
