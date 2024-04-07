// import app from "./app.js";

// app.listen(1337, () => {
//   console.log("Server running on http://localhost:1337");
// })


const express = require('express');
// import express from 'express'
const cors = require('cors');
const app = express();
const morgan = require('morgan');

const users = require('./routers/users');
const rsvpEvent = require('./routers/rsvpEvent');
const donationEvents = require('./routers/donationEvents');

// Mount the routers
app.use(cors())
app.use(express.json());
app.use (morgan("dev"))

app.use('/events', donationEvents);
app.use('/users', users);
app.use('/rsvps', rsvpEvent);
// c

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// app.listen(PORT, () => {



//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);



// });