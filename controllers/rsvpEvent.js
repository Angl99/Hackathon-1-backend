const  db  = require('../db/config'); // Assuming you have a db = require('../db/config');

// RSVP to a donation event
async function rsvpToEvent(req, res) {
  const { userId, eventId } = req.body;

  try {
    // Check if the user exists
    const user = await db.oneOrNone('SELECT * FROM Users WHERE user_id = $1', [userId]);
    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} not found` });
    }

    // Check if the event exists
    const event = await db.oneOrNone('SELECT * FROM DonationEvents WHERE event_id = $1', [eventId]);
    if (!event) {
      return res.status(404).json({ error: `Event with ID ${eventId} not found` });
    }

    // Check if the user has already RSVP'd for the event
    const existingRSVP = await db.oneOrNone('SELECT * FROM RSVPs WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
    if (existingRSVP) {
      return res.status(400).json({ error: 'User has already RSVP\'d for this event' });
    }

    // Create a new RSVP
    const newRSVP = await db.one(
      'INSERT INTO RSVPs (user_id, event_id, rsvp_status) VALUES ($1, $2, 1) RETURNING *',
      [userId, eventId]
    );

    res.status(201).json(newRSVP);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Cancel an RSVP
async function cancelRSVP(req, res) {
  const rsvpId = req.params.rsvpId;

  try {
    const deletedRSVP = await db.one('DELETE FROM RSVPs WHERE rsvp_id = $1 RETURNING *', [rsvpId]);
    res.json(deletedRSVP);
  } catch (err) {
    res.status(404).json({ error: `RSVP with ID ${rsvpId} not found` });
  }
}

// Get RSVPs for a specific event
async function getEventRSVPs(req, res) {
  const eventId = req.params.eventId;

  try {
    const rsvps = await db.any(
      'SELECT rsvps.rsvp_id, users.username FROM RSVPs JOIN Users ON rsvps.user_id = users.user_id WHERE event_id = $1',
      [eventId]
    );

    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUserRSVPs(req, res) {
  const userId = req.params.userId;

  try {
    // Check if the user exists
    const user = await db.oneOrNone('SELECT * FROM Users WHERE user_id = $1', [userId]);
    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} not found` });
    }

    const rsvps = await db.any(
      'SELECT rsvps.rsvp_id, donation_events.event_name, donation_events.event_date, donation_events.start_time, donation_events.end_time FROM RSVPs JOIN DonationEvents ON rsvps.event_id = donation_events.event_id WHERE rsvps.user_id = $1',
      [userId]
    );

    res.json(rsvps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// const db = require('./db'); // Assuming you have a db module that exports your pg-promise database instance


async function updateRSVP(req, res) {
 const {rsvpId } = req.params; // Extract RSVP ID from request parameters
 const { rsvp_status } = req.body; // Extract RSVP status from request body

 try {
    // Update the RSVP status in the database
    const result = await db.none('UPDATE RSVPs SET rsvp_status = $1 WHERE rsvp_id = $2', [rsvp_status, rsvpId]);

    // Check if the update was successful
    if (result) {
      res.status(200).json({ message: 'RSVP updated successfully' });
    } else {
      res.status(404).json({ error: 'RSVP not found' });
    }
 } catch (err) {
    // Handle any errors that occur during the update
    res.status(500).json({ error: err.message });
 }
}


module.exports = {
  rsvpToEvent,
  cancelRSVP,
  getEventRSVPs,
  getUserRSVPs,
  updateRSVP
};