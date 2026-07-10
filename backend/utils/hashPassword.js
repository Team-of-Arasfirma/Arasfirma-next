import bcrypt from 'bcryptjs';

/**
 * Hash a plain‑text password using bcrypt.
 * @param {string} plain - The password to hash.
 * @returns {Promise<string>} The hashed password.
 */
export const hashPassword = async (plain) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plain, salt);
};
