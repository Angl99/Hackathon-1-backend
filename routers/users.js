const express = require('express');
const userRouter = express.Router();

const {
  getUserById,
  getUserHostedEvents,
  getUserRSVPs,
  createUser,
  updateUser,
  getAllUsers,
} = require('./controllers/userControllers');

userRouter.get('/:id', getUserById);
userRouter.get('/:userId/hosted-events', getUserHostedEvents);
userRouter.get('/:userId/rsvps', getUserRSVPs);
userRouter.post('/create', createUser);
userRouter.put('/:id', updateUser);
userRouter.get('/', getAllUsers);

module.exports = userRouter;