const express = require('express');
const eventRouter = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('./controllers/eventControllers');

eventRouter.post('/create', createEvent);
eventRouter.get('/', getAllEvents);
eventRouter.get('/:id', getEventById);
eventRouter.put('/:id', updateEvent);
eventRouter.delete('/:id', deleteEvent);

module.exports = eventRouter;