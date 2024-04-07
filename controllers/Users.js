// import db from "../db/config.js";


// // desc : Get all users
// // route : GET /users
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await db.any('SELECT * FROM Users');
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // desc : Get a user
// // route : GET /users/:id
// export const getUser = async (req, res) => {
//   try {
//     const user = await db.any('SELECT * FROM Users WHERE id = $1', [req.params.id]);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// // desc : Create a user
// // route : POST /users
// export const createUser = async (req, res) => {
//   try {
//     const { username, email, phone_number } = req.body;
//     const newUser = await db.one('INSERT INTO Users (username, email, phone_number) VALUES ($1, $2, $3) RETURNING *', [username, email, phone_number]);
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// // desc : Update a user
// // route : PUT /users/:id
// export const updateUser = async (req, res) => {
//   try {
//     const { username, email, phone_number } = req.body;
//     const user = await db.one('UPDATE Users SET username = $1, email = $2, phone_number = $3 WHERE id = $4 RETURNING *', [username, email, phone_number, req.params.id]);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// // desc : Delete a user
// // route : DELETE /users/:id
// export const deleteUser = async (req, res) => {
//   try {
//     const user = await db.one('DELETE FROM Users WHERE id = $1 RETURNING *', [req.params.id]);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

// import db from '../db/config.js';
const db = require('../db/config');

// Get a user by ID
async function getUserById(req, res) {
  const userId = req.params.userId;

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
  const userId = req.params.userId;
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


async function deleteUser(req, res) {
  const userId = req.params.userId;
  try {
    // Delete all RSVPs associated with the user
    await db.none('DELETE FROM RSVPs WHERE user_id = $1', [userId]);

    // Delete all hosted events associated with the user
    await db.none('DELETE FROM DonationEvents WHERE organizer_id = $1', [userId]);

    const deletedUser = await db.one('DELETE FROM Users WHERE user_id = $1 RETURNING *', [userId]);
    res.json(deletedUser);
  } catch (err) {
    res.status(404).json({ error: `User with ID ${userId} not found` });
  }
}

module.exports = {
  getUserById,
  getUserHostedEvents,
  getUserRSVPs,
  createUser,
  updateUser,
  getAllUsers,
  deleteUser
};