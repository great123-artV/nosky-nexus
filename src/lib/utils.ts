import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PasswordStrength = "weak" | "medium" | "strong" | "excellent" | "invalid";

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return "invalid";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const length = password.length;

  if (length >= 12 && hasUpper && hasLower && hasNumber && hasSpecial) return "excellent";
  if (length >= 10 && hasUpper && hasLower && hasNumber) return "strong";
  if (length >= 8 && (hasUpper || hasLower) && hasNumber) return "medium";
  if (length >= 8) return "weak";

  return "invalid";
}
