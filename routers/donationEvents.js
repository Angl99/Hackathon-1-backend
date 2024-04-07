const express = require('express');
const eventRouter = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controllers/donationEvents');

eventRouter.post('/', createEvent);
eventRouter.get('/', getAllEvents);
eventRouter.get('/:eventId', getEventById);
eventRouter.put('/:eventId', updateEvent);
eventRouter.delete('/:eventId', deleteEvent);

module.exports = eventRouter;