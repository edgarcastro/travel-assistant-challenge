import type {
  TravelEntry,
  CreateTravelRequest,
  UpdateTravelRequest,
  GetTravelsResponse,
  CreateTravelResponse,
  UpdateTravelResponse,
} from "shared";

export type { TravelEntry };

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const toApiId = (id: string) => id.replace("#", "-");

const makeHeaders = (userId: string): HeadersInit => ({
  "Content-Type": "application/json",
  "x-user-id": userId,
});

export const getItems = async (userId: string): Promise<GetTravelsResponse> => {
  const res = await fetch(`${API_URL}/travels`, {
    headers: makeHeaders(userId),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const createItem = async (
  data: Omit<TravelEntry, "id" | "createdAt" | "updatedAt">,
): Promise<CreateTravelResponse> => {
  const { userId, countryCode, city, priority, notes } = data;
  const body: CreateTravelRequest = { countryCode, city, priority, notes };
  const res = await fetch(`${API_URL}/travels`, {
    method: "POST",
    headers: makeHeaders(userId),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const updateItem = async (
  id: string,
  userId: string,
  data: UpdateTravelRequest,
): Promise<UpdateTravelResponse> => {
  const res = await fetch(`${API_URL}/travels/${toApiId(id)}`, {
    method: "PUT",
    headers: makeHeaders(userId),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  console.log("it works");
  return res.json();
};

export const deleteItem = async (id: string, userId: string): Promise<void> => {
  const res = await fetch(`${API_URL}/travels/${toApiId(id)}`, {
    method: "DELETE",
    headers: makeHeaders(userId),
  });
  if (!res.ok) throw new Error(await res.text());
};
