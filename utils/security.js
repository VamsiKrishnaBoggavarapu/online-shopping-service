import bcrypt from 'bcryptjs';

export const encryptValue = async (value) => await bcrypt.hash(value, 10);
