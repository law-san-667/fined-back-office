import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string) {
  return str
    .toString() // Convert to string
    .normalize("NFD") // Normalize to decompose special characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents, etc.)
    .toLowerCase() // Convert to lowercase
    .trim() // Remove surrounding whitespace
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

export function unslugify(slug: string) {
  return slug
    .toString()
    .replace(/-/g, " ") // Replace hyphens with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces (if any)
    .trim() // Remove extra whitespace
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}
