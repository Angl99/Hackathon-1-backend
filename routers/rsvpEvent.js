const express = require('express');
const rsvpRouter = express.Router();

const {
  rsvpToEvent,
  cancelRSVP,
  getEventRSVPs,
  updateRSVP,
} = require('../controllers/rsvpEvent');

rsvpRouter.post('/', rsvpToEvent);
rsvpRouter.delete('/:rsvpId', cancelRSVP);
rsvpRouter.get('/event/:eventId', getEventRSVPs);
// rsvpRouter.get('/user/:userId', getUserRSVPs);
rsvpRouter.put('/:rsvpId', updateRSVP);

module.exports = rsvpRouter;