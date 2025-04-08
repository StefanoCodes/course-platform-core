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

export function titleToSlug(title: string) {
  // lowercase the title
  const lowerCaseTitle = title.toLowerCase();
  // replace spaces with hyphens
  const hyphenatedTitle = lowerCaseTitle.replace(/ /g, '-');
  // remove special characters
  const slug = hyphenatedTitle.replace(/[^a-z0-9-]/g, '');
  return slug;
}

// extract the video id from a youtube url
export function extractVideoId(url: string) {
  const videoId = url.split('v=')[1];
  return videoId;
}
