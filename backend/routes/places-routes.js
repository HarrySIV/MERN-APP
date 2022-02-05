const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'Famous Place',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '2- W 34th St, New York, NY 10001',
    creator: 'u1',
  },
];

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    return next(new HttpError('Could not find place by ID', 404));
  }

  res.json({ place: place });
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(new HttpError('Could not find place by user', 404));
  }

  res.json({ place: place });
});

module.exports = router;