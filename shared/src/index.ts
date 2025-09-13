// Export your shared types, interfaces, and utilities here
export * from "./types";
export * from "./schemas";

// Example utility function
export function greet(name: string): string {
  return `Hello ma Max frdd, ${name}!`;
}

// Example type
export type User = {
  id: string;
  name: string;
  email: string;
};
