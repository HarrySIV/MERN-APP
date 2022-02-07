const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
  {
    id: 'p1',
    name: 'Harry Sanders',
    email: 'test@test.com',
    password: 'testers',
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your entry', 422);
  }
  
  const { userName, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError(
      'Email has already been registered, try another email, or login.',
      422
    );
  }
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Username/Password credentials not found.', 401);
  }

  res.json({ message: 'Logged in' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
