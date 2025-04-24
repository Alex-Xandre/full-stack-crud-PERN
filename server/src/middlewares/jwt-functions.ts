import jwt from 'jsonwebtoken';

export const generateToken = (id: number): string => {
  return jwt.sign({ id }, '123', {
    expiresIn: '24h',
  });
};
