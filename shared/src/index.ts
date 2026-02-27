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

export interface TravelEntry extends TravelItem {
  id: string;
}

// POST /travels
export interface CreateTravelRequest {
  countryCode: string;
  city: string;
  priority?: "low" | "medium" | "high";
  notes?: string;
}
export type CreateTravelResponse = TravelEntry;

// GET /travels
export type GetTravelsResponse = TravelEntry[];

// PUT /travels/{id}
export interface UpdateTravelRequest {
  priority?: "low" | "medium" | "high";
  notes?: string;
}
export type UpdateTravelResponse = TravelEntry;
