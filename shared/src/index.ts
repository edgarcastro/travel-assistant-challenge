// Shared types, interfaces, and utility functions

export interface TravelItem {
  userId: string;
  countryCode: string;
  city: string;
  priority?: "low" | "medium" | "high";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  body: T;
}
