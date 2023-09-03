import createHttpError from 'http-errors';
import Users from '../models/userModel.js';
import { catchError } from '../utils/errorHandler.js';
import {
  compareEncryptedValue,
  encryptValue,
  jwtTokenGeneration,
  randomKey,
} from '../utils/security.js';
import { sendEmailTemplate } from '../utils/email.js';
import User from '../models/userModel.js';

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

export const forgotPassword = catchError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw createHttpError.Unauthorized('Invaild email, Please try again.');
  }

  const user = await Users.findOne({ email });
  if (!user) {
    throw createHttpError.Unauthorized('Invaild email, Please try again.');
  }

  const resetToken = randomKey();
  const encryptedResetToken = encryptValue(resetToken);

  user.passwordResetToken = encryptedResetToken;
  user.passwordResetTokenExpireIn = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetPasswordLink = `http://localhost:4000/api/v1/auth/resetPassword/${resetToken}`;
  const emailStatus = await sendEmailTemplate({
    from: 'appwebdev1993@gmail.com',
    to: user.email,
    subject: 'Reset Your Password',
    template: 'forgotPassword',
    context: {
      resetPasswordLink,
    },
  });

  if (!emailStatus?.response.includes('Ok')) {
    throw createHttpError.InternalServerError(
      'Unable to proccess your request. Please try again'
    );
  }

  res.status(200).json({
    errorInfo: {
      status: 'success',
      statusCode: '00',
      message:
        'Sent a email with reset password link. Please check your email and reset your password.',
    },
    resetPasswordLink,
  });
});

export const resetPassword = catchError(async (req, res, next) => {
  const { resetToken, password, confirmPassword } = req.body;
  if (!resetToken) {
    throw createHttpError.Unauthorized('Invalid token. Please try again.');
  }
  const encryptedResetToken = encryptValue(resetToken);
  const user = await User.findOne({
    passwordResetToken: encryptedResetToken,
    passwordResetTokenExpireIn: { $gt: Date.now() },
  });
  if (!user) {
    throw createHttpError.Unauthorized(
      'Reset password token is expired or invaild. Please try again.'
    );
  }
  if (!password || !confirmPassword) {
    throw createHttpError.NotFound('Invalid password. Please try again.');
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpireIn = undefined;
  const updatedUser = await user.save();

  res.status(200).json({
    errorInfo: {
      statusCode: '00',
      status: 'success',
      message: 'Your password is chnaged. Please login again.',
    },
  });
});
