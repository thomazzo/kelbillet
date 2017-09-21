CREATE DATABASE kelbillet;

\c kelbillet;

CREATE TABLE tickets (
    ID SERIAL PRIMARY KEY,
    origin VARCHAR,
    destination VARCHAR,
    price FLOAT,
    user_name VARCHAR,
    post_date DATE,
    departure_date DATE,
    departure_time TIME,
    arrival_date DATE,
    arrival_time TIME,
    url VARCHAR UNIQUE,
    ts TIMESTAMP
  );
