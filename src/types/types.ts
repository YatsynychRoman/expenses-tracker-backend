export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
}

export interface Expense {
  id?: number;
  amount: number;
  description: string;
  user_id: number;
  category_id: number;
}

export interface Trend {
  month: Date;
  amount: number;
}
