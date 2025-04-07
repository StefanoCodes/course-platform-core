import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomPassword() {
  return Math.random().toString(36).substring(2, 10);
}
export const formatDateToString = (
  date: Date,
  options?: Intl.DateTimeFormatOptions
) => {
  const dateFormated = new Date(date);
  return dateFormated.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
};