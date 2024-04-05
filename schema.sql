CREATE DATABASE donations_db;
\c donations_db

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- username, email, password, full_Name, phone_Number, location
-- -- Create DonationEvents table
CREATE TABLE DonationEvents (
    event_id SERIAL PRIMARY KEY,
    organizer_id INT REFERENCES Users(user_id) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(100) NOT NULL,
    food_type VARCHAR(50),
    quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create RSVPs table
CREATE TABLE RSVPs (
    rsvp_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) NOT NULL,
    event_id INT REFERENCES DonationEvents(event_id) NOT NULL,
    rsvp_status INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);