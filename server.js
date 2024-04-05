// import app from "./app.js";

// app.listen(1337, () => {
//   console.log("Server running on http://localhost:1337");
// })


const express = require('express');
const cors = require('cors');
const app = express();
const morgn = require('morgn');

const userRouter = require('./routes/userRouter');
const rsvpRouter = require('./routes/rsvpRouter');
const donationEventRouter = require('./routes/donationEventRouter');

// Mount the routers
app.use(cors())
app.use(express.json());
app.use(morgan("dev")

app.use('/events', donationEventRouter);
app.use('/users', userRouter);
app.use('/rsvps', rsvpRouter);
app.use('/events', eventRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// app.listen(PORT, () => {



//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);



// });