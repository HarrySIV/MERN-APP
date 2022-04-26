const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    const users = await User.find({}, '-password');
  } catch (error) {
    const err = new HttpError('Fetching users failed, please try again later');
    return next(err);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError('Invalid inputs passed, please check your entry', 422)
    );
  }

  const { name, email, password, image } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError('Signup failed, please try again later', 500);
    return next(err);
  }

  if (existingUser) {
    const err = new HttpError(
      'E-mail already exists, please use another E-mail, or login',
      422
    );
    return next(err);
  }

  const createdUser = new User({
    name: name,
    email: email,
    image: req.file.path,
    password: password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError('Signup failed, please try again.', 500);
    return next(err);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError('Login failed, please try again later', 500);
    return next(err);
  }

  if (existingUser || existingUser.password !== password) {
    const err = new HttpError('Invalid credentials, could not login', 401);
    return next(err);
  }

  res.json({
    message: 'Logged in',
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
