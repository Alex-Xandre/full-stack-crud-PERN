import pool from '../db';

export interface User {
  id?: number;
  name: string;
  username: string;
  country: string;
  email: string;
  type: string;
  photoUrl?: string;
  contact: number;
  lastname: string;
  firstname: string;
  password?:string
}

// Create User
const createUser = async (userData: User, photoUrl: string | undefined): Promise<User> => {
  const { firstname, lastname, username, country, email, type, contact } = userData;
  const result = await pool.query(
    'INSERT INTO users (firstname, lastname, username, country, email, type, photo_url, contact) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [firstname, lastname, username, country, email, type, photoUrl, contact]
  );
  return result.rows[0];
};

// Get Users
const getUsers = async (): Promise<User[]> => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

// Update User
const updateUser = async (id: number, userData: User, photoUrl: string | undefined): Promise<User> => {
  const { firstname, lastname, username, country, email, type, contact } = userData;
  const result = await pool.query(
    'UPDATE users SET firstname = $1, lastname = $2, username = $3, country = $4, email = $5, type = $6, photo_url = $7, contact = $8 WHERE id = $9 RETURNING *',
    [firstname, lastname, username, country, email, type, photoUrl, contact, id]
  );
  return result.rows[0];
};

// Delete User
const deleteUser = async (id: number): Promise<User> => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

const getUserForLogin = async (username: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username]);
  return result.rows[0] || null;
};
export { createUser, getUsers, updateUser, deleteUser, getUserForLogin };
