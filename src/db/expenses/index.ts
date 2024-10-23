import client from '../index.ts';
import { Expense } from '../../types/types.ts';

export const createExpense = async (expense: Expense): Promise<Expense> => {
  const { amount, description, user_id, category_id } = expense;
  try {
    const result = await client.queryObject<Expense>(`
      INSERT INTO expenses (amount, description, user_id, category_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [amount, description, user_id, category_id]);

    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('Error creating expense');
  }
};

export const deleteExpense = async (id: number, userId: number): Promise<void> => {
  try {
    const expense = await client.queryObject(`SELECT * FROM expenses WHERE id = $1 AND user_id = $2`, [id, userId]);
    if (expense.rows.length === 0) {
      throw new Error('Expense not found');
    }
    await client.queryObject(`DELETE FROM expenses WHERE id = $1 AND user_id = $2`, [id, userId]);
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting expense');
  }
};

export const editExpense = async (id: number, userId: number, partialExpense: Partial<Expense>): Promise<Expense> => {
  try {
    const updateFields = Object.entries(partialExpense)
      .filter(([key]) => key !== 'id' && key !== 'userId')
      .map(([key, _value], index) => `${key} = $${index + 3}`)
      .join(', ');

    const values = Object.values(partialExpense).filter((_, index) => 
      Object.keys(partialExpense)[index] !== 'id' && Object.keys(partialExpense)[index] !== 'userId'
    );

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    const result = await client.queryObject<Expense>(`
      UPDATE expenses
      SET ${updateFields}
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [id, userId, ...values]);

    if (result.rowCount === 0) {
      throw new Error('Expense not found or user not authorized');
    }

    return result.rows[0];
  } catch (error) {
    console.error(error);
    throw new Error('Error updating expense');
  }
};

export const getExpenses = async (
  userId: number,
  options?: {
    categoryId?: number | null;
    dateFrom?: string | null;
    dateTo?: string | null;
  }
): Promise<Expense[]> => {
  let query = 'SELECT * FROM expenses WHERE user_id = $1';
  const queryParams: (number | string)[] = [userId];
  let paramCounter = 2;

  if (options?.categoryId) {
    query += ` AND category_id = $${paramCounter}`;
    queryParams.push(options.categoryId);
    paramCounter++;
  }

  if (options?.dateFrom) {
    query += ` AND created_at >= $${paramCounter}`;
    queryParams.push(options.dateFrom);
    paramCounter++;
  }

  if (options?.dateTo) {
    query += ` AND created_at <= $${paramCounter}`;
    queryParams.push(options.dateTo);
  }

  const result = await client.queryObject<Expense>(query, queryParams);
  return result.rows;
};

export const getExpensesByCategory = async (categoryId: number): Promise<Expense[]> => {
  const result = await client.queryObject<Expense>(`SELECT * FROM expenses WHERE category_id = $1`, [categoryId]);
  return result.rows;
};

export const getExpensesByDate = async (userId: number, { dateFrom, dateTo }: { dateFrom: string, dateTo: string }): Promise<Expense[]> => {
  const result = await client.queryObject<Expense>(`SELECT * FROM expenses WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3`, [userId, dateFrom, dateTo]);
  if (result.rows.length === 0) {
    return [];
  }
  return result.rows;
};
