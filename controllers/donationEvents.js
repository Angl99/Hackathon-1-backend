const db = require('../db');

// Create a new donation event
async function createEvent(req, res) {
  const { organizerId, eventName, description, eventDate, startTime, endTime, location, foodType, quantity } = req.body;

  try {
    // Check if the organizer user exists
    const organizer = await db.oneOrNone('SELECT * FROM Users WHERE user_id = $1', [organizerId]);
    if (!organizer) {
      return res.status(404).json({ error: `User with ID ${organizerId} not found` });
    }

    const newEvent = await db.one(
      'INSERT INTO DonationEvents (organizer_id, event_name, description, event_date, start_time, end_time, location, food_type, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [organizerId, eventName, description, eventDate, startTime, endTime, location, foodType, quantity]
    );

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all donation events
async function getAllEvents(req, res) {
  try {
    const events = await db.any('SELECT * FROM DonationEvents');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a donation event by ID
async function getEventById(req, res) {
  const eventId = req.params.id;

  try {
    const event = await db.one('SELECT * FROM DonationEvents WHERE event_id = $1', [eventId]);
    res.json(event);
  } catch (err) {
    res.status(404).json({ error: `Event with ID ${eventId} not found` });
  }
}

// Update a donation event
async function updateEvent(req, res) {
  const eventId = req.params.id;
  const { eventName, description, eventDate, startTime, endTime, location, foodType, quantity } = req.body;

  try {
    const updatedEvent = await db.one(
      'UPDATE DonationEvents SET event_name = $1, description = $2, event_date = $3, start_time = $4, end_time = $5, location = $6, food_type = $7, quantity = $8 WHERE event_id = $9 RETURNING *',
      [eventName, description, eventDate, startTime, endTime, location, foodType, quantity, eventId]
    );

    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Delete a donation event
async function deleteEvent(req, res) {
  const eventId = req.params.id;

  try {
    // Delete all RSVPs associated with the event
    await db.none('DELETE FROM RSVPs WHERE event_id = $1', [eventId]);

    const deletedEvent = await db.one('DELETE FROM DonationEvents WHERE event_id = $1 RETURNING *', [eventId]);
    res.json(deletedEvent);
  } catch (err) {
    res.status(404).json({ error: `Event with ID ${eventId} not found` });
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};