const db = require('../db');

// Get a user by ID
async function getUserById(req, res) {
  const userId = req.params.id;

  try {
    const user = await db.one('SELECT * FROM Users WHERE user_id = $1', [userId]);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: `User with ID ${userId} not found` });
  }
}

// Get events hosted by a user
async function getUserHostedEvents(req, res) {
  const userId = req.params.userId;

  try {
    const events = await db.any(
      'SELECT * FROM DonationEvents WHERE organizer_id = $1',
      [userId]
    );
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get events a user has RSVP'd for
async function getUserRSVPs(req, res) {
  const userId = req.params.userId;

  try {
    const rsvps = await db.any(
      'SELECT rsvps.rsvp_id, donation_events.event_name, donation_events.event_date, donation_events.start_time, donation_events.end_time FROM RSVPs JOIN DonationEvents ON rsvps.event_id = donation_events.event_id WHERE rsvps.user_id = $1',
      [userId]
    );

    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req, res) {
  const { username, email, password, fullName, phoneNumber, location } = req.body;

  try {
    // Check if the username or email is already in use
    const existingUser = await db.oneOrNone(
      'SELECT * FROM Users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already in use' });
    }

    const newUser = await db.one(
      'INSERT INTO Users (username, email, password_hash, full_name, phone_number, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [username, email, password, fullName, phoneNumber, location]
    );

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update a user
async function updateUser(req, res) {
  const userId = req.params.id;
  const { username, email, password, fullName, phoneNumber, location } = req.body;

  try {
    const updatedUser = await db.one(
      'UPDATE Users SET username = $1, email = $2, password_hash = $3, full_name = $4, phone_number = $5, location = $6 WHERE user_id = $7 RETURNING *',
      [username, email, password, fullName, phoneNumber, location, userId]
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await db.any('SELECT * FROM Users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getUserById,
  getUserHostedEvents,
  getUserRSVPs,
  createUser,
  updateUser,
  getAllUsers
};