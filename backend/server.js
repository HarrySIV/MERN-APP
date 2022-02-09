const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const server = express();

server.use(bodyParser.json());

server.use('/api/places', placesRoutes);
server.use('/api/users', usersRoutes);

server.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

server.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unkown error occurred' });
});

mongoose
  .connect('mongodb+srv://harrysiv:ThisIsIt!1@cluster0.d9kcs.mongodb.net/places?retryWrites=true&w=majority')
  .then(() => server.listen(5000))
  .catch((error) => console.log(error));
