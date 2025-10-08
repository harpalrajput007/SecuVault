// Simple auth context for storing user password (for encryption)
export const setUserPassword = (password: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('userPassword', password);
  }
};

export const getUserPassword = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('userPassword');
  }
  return null;
};

export const clearUserPassword = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('userPassword');
  }
};