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
export function extractYoutubeVideoId(url: string) {
  const videoId = url.split('v=')[1];
  return videoId;
}
export function extractVimeoVideoId(url: string) {
  const videoId = url.split("/").pop()
  return videoId
}

// format names displayname function (to display only the first 2 names of the user incase he may have 5 names)
export function displayName(name: string) {
  const names = name.split(" ");
  if (names.length > 2) {
    return `${names[0]} ${names[1]}`;
  }
  return name;
}
