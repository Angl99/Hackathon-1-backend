const express = require('express');
const users = express.Router();

const {
  getUserById,
  getUserHostedEvents,
  getUserRSVPs,
  createUser,
  updateUser,
  getAllUsers,
  deleteUser
} = require('../controllers/users');

users.get('/:userId', getUserById);
users.get('/:userId/hosted-events', getUserHostedEvents);
users.get('/:userId/rsvps', getUserRSVPs);
users.post('/', createUser);
users.put('/:userId', updateUser);
users.get('/', getAllUsers);
users.delete('/:userId', deleteUser);

module.exports = users;