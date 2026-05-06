import { z } from 'zod';

/**
 * Sanitizes name by trimming and removing multiple spaces
 */
export const sanitizeName = (name: string) => {
  return name.trim().replace(/\s\s+/g, ' ');
};

/**
 * Common regex patterns
 */
export const passwordPatterns = {
  minLength: /.{8,}/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[@$!%*?&]/,
};

/**
 * Signup Validation Schema
 */
export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .transform(sanitizeName)
    .refine((val) => val.length >= 2, {
      message: 'Name must be at least 2 characters long',
    })
    .refine((val) => /^[a-zA-Z\s]*$/.test(val), {
      message: 'Name can only contain alphabets and spaces',
    })
    .refine((val) => !/[<>"/\\|]/.test(val), {
      message: 'Invalid characters in name',
    }),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(passwordPatterns.uppercase, 'Password must contain at least one uppercase letter')
    .regex(passwordPatterns.lowercase, 'Password must contain at least one lowercase letter')
    .regex(passwordPatterns.number, 'Password must contain at least one number')
    .regex(passwordPatterns.special, 'Password must contain at least one special character (@$!%*?&)')
    .trim(),
  terms: z.boolean(),
});

/**
 * Login Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
    .trim(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
