import User from '../models/userModel.js';

export const signup = async (req, res, next) => {
  const { firstname, lastname, email, password, confirmPassword, dob, gender } =
    req.body;

  try {
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      dob: new Date(dob),
      gender,
    });

    res.status(201).json({
      errorInfo: {},
      data: {
        user: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          fullname: user.fullname,
          email: user.email,
          dob: user.dob,
          gender: user.gender,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
