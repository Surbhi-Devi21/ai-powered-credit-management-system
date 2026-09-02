import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token (JWT) with user identifier and role payload.
 *
 * @param {string} id - The MongoDB User ObjectId
 * @param {string} role - The user role (e.g. 'owner')
 * @returns {string} - Signed JWT token
 */
export const generateToken = (id, role = 'owner') => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};
