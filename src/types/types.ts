import { type Handler } from '@std/http';

export type User = {
  id: number;
  username: string;
  password: string;
  name: string;
  surname: string;
  currency: Currency;
  email: string;
  refresh_token: string;
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

export interface ExpensesByCategory {
  id: number;
  name: string;
  total: number;
}

export enum Currency {
  UAH = 'UAH',
  USD = 'USD',
  EUR = 'EUR',
}

export interface AuthenticatedRequest extends Request {
  userId: number;
}

export interface AuthenticatedHandler extends Handler {
  (request: AuthenticatedRequest, info?: Deno.ServeHandlerInfo, params?: URLPatternResult | null): Response | Promise<Response>
}