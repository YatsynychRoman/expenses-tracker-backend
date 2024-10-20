import client from '../index.ts';

import { User } from '../../types/types.ts';

export const getUserByLogin = async (login: string): Promise<User | null> => {
  const result = await client.queryObject<User | null>('SELECT * from users WHERE email LIKE $1 OR username LIKE $1', [login]);
  if (!result) {
    return null;
  }
  
  return result.rows[0];
}

export const createNewUser = async ({ username, email, password }: { username: string, email: string, password: string }): Promise<void> => {
  try {
    await client.queryObject('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
  } catch (e) {
    console.error(e)
    throw new Error('Failed to create User record');
  }
}