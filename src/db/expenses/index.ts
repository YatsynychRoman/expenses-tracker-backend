import client from '../index.ts';
import { 
  Expense,
  Trend,
  ExpensesByCategory,
} from '../../types/types.ts';

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
  const expense = await client.queryObject(`SELECT * FROM expenses WHERE id = $1 AND user_id = $2`, [id, userId]);
    if (expense.rows.length === 0) {
    throw new Error('Expense not found');
  }
  try {
    await client.queryObject(`DELETE FROM expenses WHERE id = $1 AND user_id = $2`, [id, userId]);
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting expense');
  }
};

export const editExpense = async (id: number, userId: number, partialExpense: Partial<Expense>): Promise<Expense> => {
  const expense = await client.queryObject(`SELECT * FROM expenses WHERE id = $1 AND user_id = $2`, [id, userId]);
  if (expense.rows.length === 0) {
    throw new Error('Expense not found');
  }
  try {
    const updateFields = Object.entries(partialExpense)
      .filter(([key]) => key !== 'id' && key !== 'userId')
      .filter(([_, value]) => !!value)
      .map(([key, _value], index) => `${key} = $${index + 3}`)
      .join(', ');

    const values = Object.values(partialExpense).filter((value, index) => 
      Object.keys(partialExpense)[index] !== 'id' && Object.keys(partialExpense)[index] !== 'userId' && !!value
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

export const getExpensesByDate = async (
  userId: number,
  { dateFrom, dateTo }: { dateFrom: string, dateTo: string }
): Promise<Expense[]> => {
  const result = await client.queryObject<Expense>(`SELECT * FROM expenses WHERE user_id = $1 AND created_at >= $2 AND created_at <= $3`, [userId, dateFrom, dateTo]);
  if (result.rows.length === 0) {
    return [];
  }
  return result.rows;
};

export const getTrends = async (
  userId: number,
  options?: { 
    dateFrom?: string | null;
    dateTo?: string | null;
    categoryId?: number | null;
    type?: string | null;
  }
): Promise<Trend[]> => {
  let query = `
  SELECT DATE_TRUNC('${options?.type || 'month'}', created_at) at time zone 'UTC' AS ${options?.type || 'month'}, SUM(amount) as amount FROM expenses e
  WHERE e.user_id = $1
  `;

  const queryParams: (number | string)[] = [userId];

  if (options?.dateFrom) {
    query += ` AND created_at >= $${queryParams.length + 1}`;
    queryParams.push(options.dateFrom);
  }
  if (options?.dateTo) {
    query += ` AND created_at <= $${queryParams.length + 1}`;
    queryParams.push(options.dateTo);
  }
  if (options?.categoryId) {
    query += ` AND category_id = $${queryParams.length + 1}`;
    queryParams.push(options.categoryId);
  }

  query += ` GROUP BY ${options?.type || 'month'} ORDER BY ${options?.type || 'month'}`;
  const result = await client.queryObject<Trend>(query, queryParams);

  return result.rows;
};


export const getExpensesByCategories = async (userId: number): Promise<ExpensesByCategory[]> => {
  try {
    const result = await client.queryObject<ExpensesByCategory>(`
      SELECT c.id, c.name, sum(e.amount) as total FROM expenses e 
      JOIN categories c ON c.id = e.category_id 
      WHERE e.user_id = $1
      group BY c.id, c.name
      `, [userId]);
    return result.rows.length > 0 ? result.rows : [];
  } catch (error) {
    console.error('Error fetching expenses categories:', error);
    throw error;
  }
};
