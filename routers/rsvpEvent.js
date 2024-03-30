const express = require('express');
const rsvpRouter = express.Router();

const {
  rsvpToEvent,
  cancelRSVP,
  getEventRSVPs,
} = require('./controllers/rsvpControllers');

rsvpRouter.post('/rsvp', rsvpToEvent);
rsvpRouter.delete('/cancel/:id', cancelRSVP);
rsvpRouter.get('/event/:eventId', getEventRSVPs);

module.exports = rsvpRouter;