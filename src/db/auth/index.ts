import client from '../index.ts';

import { User } from '../../types/types.ts';

export const getUserByLogin = async (login: string): Promise<User | null> => {
  const result = await client.queryObject<User | null>('SELECT * from users WHERE email LIKE $1 OR username LIKE $1', [login]);
  if (!result.rows.length) {
    return null;
  }
  
  return result.rows[0];
}

export const createNewUser = async ({ username, email, password }: { username: string, email: string, password: string }): Promise<void> => {
  try {
    await client.queryObject('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
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
    const result = await client.queryObject<User | null>('SELECT * FROM users WHERE id = $1 AND refresh_token = $2', [userId, refreshToken]);
    if (!result.rows.length) {
      return null;
    }
    return result.rows[0];
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get user by ID and refresh token');
  }
}
