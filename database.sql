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
	profile_photo TEXT
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
);
