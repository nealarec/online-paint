// Shared types and interfaces
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
