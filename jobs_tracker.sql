CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "hash" VARCHAR (1000) NOT NULL,
    "type" VARCHAR (10) NOT NULL,
    "email" VARCHAR (100) UNIQUE NOT NULL,
    "validated" BOOLEAN NOT NULL  
);

CREATE TABLE "profiles" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT UNIQUE NOT NULL REFERENCES users,
    "bio" VARCHAR(400) NOT NULL,
    "contact_info" VARCHAR(60) NOT NULL
);

CREATE TABLE "resources" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (200),
    "url" VARCHAR (300),
    "summary" VARCHAR (500),
    "date_created" DATE DEFAULT current_date
);

CREATE TABLE "job_type" (
    "id" SERIAL PRIMARY KEY,
    "type" varchar(20),
    CONSTRAINT chk_type CHECK (type IN ('full_stack', 'dev_ops', 'front_end', 'back_end', 'other_engineer', 'other'))
);

CREATE TABLE "application_phase" (
    "id" SERIAL PRIMARY KEY,
    "phase" varchar(20),
    CONSTRAINT chk_phase CHECK (phase IN ('applied', 'followed_up', 'declined', 'phone_interview', 'inperson_interview'))
);

CREATE TABLE "locations"(
    "id" SERIAL PRIMARY KEY,
    "address" varchar(200), 
    "lat" DECIMAL(9,6),
    "lng" DECIMAL (9,6)
);

CREATE TABLE "company_contact"(
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR (200) NOT NULL,
	"title" VARCHAR (200) NOT NULL,
	"company" VARCHAR (200) NOT NULL,
	"email_address" VARCHAR (100) UNIQUE NOT NULL,
	"linkedin_url" VARCHAR (300),
	"comments" VARCHAR (1000),
	"date_contacted" DATE DEFAULT current_date
);

CREATE TABLE "job_tracker"(
	"id" SERIAL PRIMARY KEY,
	"location_id" INT NOT NULL REFERENCES locations,
	"user_id" INT NOT NULL REFERENCES users,
	"date_applied" DATE DEFAULT current_date,
	"follow_up_date" DATE DEFAULT now() + '11 days',
	"job_title" VARCHAR(200) NOT NULL,
	"job_type" INT NOT NULL REFERENCES job_type,
	"application_phase" INT NOT NULL REFERENCES application_phase,
	"company_contact" INT NOT NULL REFERENCES company_contact,
	"company_name" INT NOT NULL REFERENCES "locations",
	"company_url" VARCHAR(200) NOT NULL,
	"comments" VARCHAR(1000)
);