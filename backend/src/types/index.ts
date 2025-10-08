export interface VaultItem {
  _id?: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category?: string;
  isFavorite?: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  _id?: string;
  email: string;
  password: string;
  twoFactorSecret?: string;
  twoFactorEnabled?: boolean;
  createdAt?: Date;
}