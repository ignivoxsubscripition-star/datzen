import { passwordPatterns } from '../validations/auth';

export type PasswordStrength = 'Weak' | 'Medium' | 'Strong' | 'Very Strong';

export interface StrengthResult {
  score: number;
  label: PasswordStrength;
  color: string;
}

/**
 * Calculates password strength based on regex matches
 */
export const calculatePasswordStrength = (password: string): StrengthResult => {
  if (!password) {
    return { score: 0, label: 'Weak', color: 'bg-slate-200' };
  }

  let score = 0;

  // Each requirement adds to the score
  if (password.length >= 8) score++;
  if (passwordPatterns.uppercase.test(password)) score++;
  if (passwordPatterns.lowercase.test(password)) score++;
  if (passwordPatterns.number.test(password)) score++;
  if (passwordPatterns.special.test(password)) score++;

  // Minimum length check (if less than 8, it's always weak)
  if (password.length < 8) {
    return { score: 1, label: 'Weak', color: 'bg-red-500' };
  }

  if (score <= 2) {
    return { score, label: 'Weak', color: 'bg-red-500' };
  } else if (score <= 4) {
    return { score, label: 'Medium', color: 'bg-yellow-500' };
  } else {
    return { score, label: 'Strong', color: 'bg-green-500' };
  }
};
