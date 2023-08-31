import createHttpError from 'http-errors';
import Users from '../models/userModel.js';
import { catchError } from '../utils/errorHandler.js';
import {
  compareEncryptedValue,
  jwtTokenGeneration,
} from '../utils/security.js';

export const signup = catchError(async (req, res, next) => {
  const { firstname, lastname, email, password, confirmPassword, dob, gender } =
    req.body;

  const user = await Users.create({
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
    dob: new Date(dob),
    gender,
  });

  const token = jwtTokenGeneration(user.id);

  res.cookie('token', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false, // prod it should be true
    signed: true,
  });
  res.status(201).json({
    errorInfo: {},
    data: {
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        fullname: user.fullname,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
      },
    },
  });
});

export const login = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createHttpError.Unauthorized(
      'Invaild email or password, Please try again.'
    );
  }

  const user = await Users.findOne({ email }).select('+password');
  if (!user) {
    throw createHttpError.Unauthorized('Invaild email, Please try again.');
  }

  const isValid = await compareEncryptedValue(password, user.password);
  if (!isValid) {
    throw createHttpError.Unauthorized('Invaild password, Please try again.');
  }

  user.password = undefined;
  const token = jwtTokenGeneration(user.id);

  res.cookie('token', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false, // prod it should be true
    signed: true,
  });
  res.status(200).json({
    errorInfo: {
      statusCode: '00',
      status: 'success',
    },
    data: { user },
  });
});
