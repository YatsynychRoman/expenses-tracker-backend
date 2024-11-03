import client from '../index.ts';

import { User } from '../../types/types.ts';

export const getUserByLogin = async (login: string): Promise<User | null> => {
  const result = await client.queryObject<User>('SELECT * from users WHERE email LIKE $1 OR username LIKE $1', [login]);
  if (!result.rows.length) {
    return null;
  }
  
  return result.rows[0];
}

export const createNewUser = async (
  { 
    username,
    email,
    name,
    surname,
    currency,
    password
  } : Omit<User, 'id' | 'refresh_token'>
): Promise<void> => {
  try {
    await client.queryObject('INSERT INTO users (username, email, name, surname, currency, password) VALUES ($1, $2, $3, $4, $5, $6)', [username, email, name, surname, currency, password]);
  } catch (e) {
    console.error(e);
    throw new Error('Failed to create User record');
  }
}

export const updateUserRefreshToken = async ({ userId, refreshToken }: { userId: number, refreshToken: string }) => {
  try {
    await client.queryObject('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, userId])
  } catch (e) {
    console.error(e);
    throw new Error('Failed to update refresh token');
  }
}

export const getUserByIdAndRefreshToken = async ({ userId, refreshToken }: { userId: number, refreshToken: string }): Promise<User | null> => {
  try {
    const result = await client.queryObject<User>('SELECT id, username, name, surname, currency, email FROM users WHERE id = $1 AND refresh_token = $2', [userId, refreshToken]);
    if (!result.rows.length) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get user by ID and refresh token');
  }
}

export const getUserById = async (userId: string): Promise<User | null> => {
  try { 
    const result = await client.queryObject<User>('SELECT id, username, email, name, surname, currency FROM users WHERE id = $1', [userId]);
    if (!result.rows.length) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get user by ID');
  }
}

export const updateUser = async (userId: string, { ...options }: Partial<User>): Promise<Omit<User, 'password' | 'refresh_token'>> => {
  const user = await client.queryObject<User>('SELECT * FROM users WHERE id = $1', [userId]);
  if (user.rows.length === 0) {
    throw new Error('User not found');
  }
  try {
    const updateFields = Object.entries(options)
      .filter(([key]) => key !== 'id')
      .filter(([_, value]) => !!value)
      .map(([key, _value], index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = Object.values(options).filter((value, index) => 
      Object.keys(options)[index] !== 'id' && !!value
    );

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }
    
    const result = await client.queryObject<User>(`
      UPDATE users
      SET ${updateFields}
      WHERE id = $1
      RETURNING *
    `, [userId, ...values]);

    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    const { name, surname, email, username, id, currency } = result.rows[0];
    return {
      name,
      surname,
      email,
      username,
      id,
      currency,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error updating user');
  }
}

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await client.queryObject('DELETE FROM users WHERE id = $1', [userId]);
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting user');
  }
}
