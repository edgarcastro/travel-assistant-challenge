// Shared types, interfaces, and utility functions

export interface TravelItem {
  id: string;
  destination: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  body: T;
}
