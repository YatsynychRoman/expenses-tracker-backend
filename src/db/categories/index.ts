import client from '../../db/index.ts';
import { Category } from '../../types/types.ts';

export const getCategories = async (userId: number): Promise<Category[] | null> => {
  try {
    const result = await client.queryObject<Category>('SELECT * FROM categories WHERE user_id = $1 OR user_id IS NULL', [userId]);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (userId: number, name: string): Promise<void> => {
  try {
    await client.queryObject('INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *', [userId, name]);
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: number, userId: number): Promise<void> => {
  try {
    await client.queryObject('DELETE FROM categories WHERE id = $1 AND user_id = $2', [categoryId, userId]);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const editCategory = async (categoryId: number, name: string): Promise<void> => {
  try {
    await client.queryObject('UPDATE categories SET name = $1 WHERE id = $2', [name, categoryId]);
  } catch (error) {
    console.error('Error editing category:', error);
    throw error;
  }
};

export const getCategory = async (categoryId: number, userId: number): Promise<Category | null> => {
  try {
    const category = await client.queryObject<Category | null>('SELECT * FROM categories WHERE id = $1 AND user_id = $2 OR user_id IS NULL', [categoryId, userId]);
    if (!category?.rows.length) {
      return null;
    }
    return category.rows[0];
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const getCategoryByName = async (userId: number, name: string): Promise<Category | null> => {
  try {
    const category = await client.queryObject<Category | null>('SELECT * FROM categories WHERE user_id = $1 AND name = $2', [userId, name]);
    return category?.rows[0] || null;
  } catch (error) {
    console.error('Error fetching category by name:', error);
    throw error;
  }
};
