import { Schema, model } from 'mongoose';
import { RegExp_Alpha_Space, RexExp_Email } from '../utils/globalConst.js';
import { encryptValue } from '../utils/security.js';

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Firstname is required.'],
      validate: {
        validator: (val) => new RegExp(RegExp_Alpha_Space).test(val),
        message: 'Firstname allow only alphabates.',
      },
      minlength: [3, 'Firstname allow above 3 charators.'],
      maxlength: [40, 'Firstname allow below 40 charators.'],
    },
    lastname: {
      type: String,
      required: [true, 'Lastname is required.'],
      validate: {
        validator: (val) => new RegExp(RegExp_Alpha_Space).test(val),
        message: 'Lastname allow only alphabates.',
      },
      minlength: [3, 'Lastname allow above 3 charators.'],
      maxlength: [40, 'Lastname allow below 40 charators.'],
    },
    email: {
      type: String,
      required: [true, 'Emailid is required.'],
      unique: true,
      validate: {
        validator: (val) => new RegExp(RexExp_Email).test(val),
        message: 'Invaild email, Please check again.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password having minium 6 charactors.'],
      maxlength: [12, 'Password having maxium 12 charactors.'],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm password is required.'],
      validate: {
        validator: function (confPsw) {
          return confPsw === this.password;
        },
        message: 'Password and confirm password are not match.',
      },
    },
    dob: {
      type: Date,
      required: [true, 'DOB is required.'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required.'],
      enum: {
        values: ['male', 'female', 'others'],
        message: 'Gender should be male or female or others.',
      },
    },
    photo: {
      id: String,
      imageUrl: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpireIn: {
      type: Date,
      select: false,
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    virtuals: {
      fullname: {
        get() {
          return `${this.firstname} ${this.lastname}`;
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function () {
  if (!this.password) return;
  this.password = await encryptValue(this.password);
  this.confirmPassword = undefined;
});

const User = model('users', userSchema);

export default User;
