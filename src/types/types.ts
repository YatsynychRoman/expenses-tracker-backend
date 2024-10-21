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
