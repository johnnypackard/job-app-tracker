CREATE TABLE person (
	id SERIAL PRIMARY KEY,
	username VARCHAR (80) UNIQUE NOT NULL,
	password VARCHAR (1000) NOT NULL
);

CREATE TABLE registered_users (
	id SERIAL PRIMARY KEY,
	person_id INT REFERENCES "person",
	profile_image VARCHAR (1000),
	gender VARCHAR (100),
	pronouns VARCHAR (100),
	admin BOOLEAN NOT NULL
);

CREATE TABLE businesses (
	id SERIAL PRIMARY KEY,
	biz_name VARCHAR (1000),
	contact_name VARCHAR (100),
	address VARCHAR (500),
	gender VARCHAR (100),
	race VARCHAR (100),
	language VARCHAR (100)
);

CREATE TABLE reviews (
	id SERIAL PRIMARY KEY,
	rating INT,
	comment VARCHAR (1000),
	biz_id INT REFERENCES "businesses"
);

CREATE TABLE favorites (
	id SERIAL PRIMARY KEY,
	user_id INT REFERENCES "registered_users",
	biz_id INT REFERENCES "businesses"
);