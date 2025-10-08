export const generatePassword = (
  length: number = 12,
  includeLetters: boolean = true,
  includeNumbers: boolean = true,
  includeSymbols: boolean = true,
  excludeLookAlikes: boolean = true
): string => {
  let chars = '';
  
  if (includeLetters) {
    chars += excludeLookAlikes ? 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }
  if (includeNumbers) {
    chars += excludeLookAlikes ? '23456789' : '0123456789';
  }
  if (includeSymbols) {
    chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }
  
  if (!chars) return '';
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};