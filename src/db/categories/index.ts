import client from '../../db/index.ts';
import { Category } from '../../types/types.ts';

export const getCategories = async (userId: string): Promise<Category[] | null> => {
  try {
    const categories = await client.queryObject<Category[] | null>('SELECT * FROM categories WHERE user_id = $1 OR user_id IS NULL', [userId]);
    if (!categories.rows.length) {
      return null;
    }
    return categories.rows[0];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (userId: string, name: string): Promise<void> => {
  try {
    await client.queryObject('INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *', [userId, name]);
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: number, userId: string): Promise<void> => {
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

export const getCategory = async (categoryId: number, userId: string): Promise<Category | null> => {
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
