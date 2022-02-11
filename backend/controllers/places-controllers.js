const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceByID = async (req, res, next) => {
  const placeID = req.params.pid;
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

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userID).populate('places');
  } catch (error) {
    const err = new HttpError(
      'Fetching places failed, please try again later',
      500
    );
    return next(err);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find a places for the provided user id.', 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
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

  let user;

  try {
    user = await User.findById(creator);
  } catch (error) {
    const err = new HttpError('Creating place failed, please try again.', 500);
    return next(err);
  }

  if (!user) {
    const err = new HttpError('Could not find user by that ID', 404);
    return next(err);
  }

  console.log(user);

  try {
    const sesh = await mongoose.startSession();
    sesh.startTransaction();
    await createdPlace.save({ session: sesh });
    user.places.push(createPlace);
    await user.save({ session: sesh });
    await sesh.commitTransaction();
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
    return next(
      new HttpError('Invalid inputs passed, please check your entry', 422)
    );
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
    place = await Place.findById(placeID).populate('creator');
  } catch (error) {
    const err = new HttpError(
      'Something went wrong, could not delete place',
      500
    );
    return next(err);
  }

  if (!place) {
    const err = new HttpError('Could not find a place with this ID', 404);
    return next(err);
  }

  try {
    const sesh = await mongoose.startSession();
    sesh.startTransaction();
    await place.remove({ session: sesh });
    place.creator.places.pull(place);
    await place.creator.save({ session: sesh });
    await sesh.commitTransaction();
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
