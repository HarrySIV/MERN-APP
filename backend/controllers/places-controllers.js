const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
];

const getPlaceByID = async (req, res, next) => {
  const placeID = req.params.pid; // { pid: 'p1' }
  let place;
  try {
    place = await Place.findById(placeID);
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not find a place',
      500
    );
    return next(error);
  }

  if (!place) {
    const err = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(err);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserID = async (req, res, next) => {
  const userID = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userID });
  } catch (error) {
    const err = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(err);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a places for the provided user id.', 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your entry', 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title: title,
    description: description,
    address: address,
    location: coordinates,
    image: image,
    creator: creator,
  });

  try {
    await createPlace.save();
  } catch (error) {
    const err = new HttpError('Creating place failed, please try again.', 500);
    return next(err);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your entry', 422);
  }

  const { title, description } = req.body;
  const placeID = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeID);
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(err);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(err);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeID = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeID);
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not delete place',
      500
    );
    return next(err);
  }

  try {
    await place.remove();
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(err);
  }

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceByID = getPlaceByID;
exports.getPlacesByUserID = getPlacesByUserID;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
