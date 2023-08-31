import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const encryptValue = async (value) => await bcrypt.hash(value, 10);

export const compareEncryptedValue = async (normalValue, encryptedValue) =>
  await bcrypt.compare(normalValue, encryptedValue);

export const jwtTokenGeneration = (id) => {
  const payload = { id };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: 24 * 60 * 60 * 1000 };

  return jwt.sign(payload, secret, options);
};
