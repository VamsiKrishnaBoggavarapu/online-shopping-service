import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const highlyEncryptValue = async (value) => await bcrypt.hash(value, 10);

export const compareEncryptedValue = async (normalValue, encryptedValue) =>
  await bcrypt.compare(normalValue, encryptedValue);

export const jwtTokenGeneration = (id) => {
  const payload = { id };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: 24 * 60 * 60 * 1000 };

  return jwt.sign(payload, secret, options);
};

export const randomKey = () => crypto.randomBytes(32).toString('hex');

export const encryptValue = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');
