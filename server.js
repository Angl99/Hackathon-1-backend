import app from "./app.js";

app.listen(1337, () => {
  console.log("Server running on http://localhost:1337");
})
const express = require('express');
const app = express();

const userRouter = require('./routes/userRouter');
const rsvpRouter = require('./routes/rsvpRouter');
const eventRouter = require('./routes/eventRouter');

// Mount the routers
app.use('/users', userRouter);
app.use('/rsvps', rsvpRouter);
app.use('/events', eventRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});