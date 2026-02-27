import type { TravelItem } from "shared";

export interface TravelEntry extends TravelItem {
  id: string; // "${countryCode}#${city}"
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const makeId = (countryCode: string, city: string) => `${countryCode}#${city}`;

let store: TravelEntry[] = [
  {
    id: makeId("CO", "CARTAGENA"),
    userId: "edgar.castro.villa@outlook.com",
    countryCode: "CO",
    city: "CARTAGENA",
    priority: "high",
    notes: "Visitar durante la temporada de diciembre",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: makeId("CO", "MEDELLIN"),
    userId: "edgar.castro.villa@outlook.com",
    countryCode: "CO",
    city: "MEDELLIN",
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getItems = async (userId: string): Promise<TravelEntry[]> => {
  await delay(300);
  return store.filter((item) => item.userId === userId);
};

export const createItem = async (
  data: Omit<TravelEntry, "id" | "createdAt" | "updatedAt">,
): Promise<TravelEntry> => {
  await delay(200);
  const now = new Date().toISOString();
  const entry: TravelEntry = {
    ...data,
    id: makeId(data.countryCode, data.city),
    createdAt: now,
    updatedAt: now,
  };
  store.push(entry);
  return entry;
};

export const updateItem = async (
  id: string,
  data: Pick<TravelItem, "countryCode" | "city" | "priority" | "notes">,
): Promise<TravelEntry> => {
  await delay(200);
  const idx = store.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Item not found");
  const updated: TravelEntry = {
    ...store[idx],
    ...data,
    id: makeId(data.countryCode, data.city),
    updatedAt: new Date().toISOString(),
  };
  store[idx] = updated;
  return updated;
};

export const deleteItem = async (id: string): Promise<void> => {
  await delay(200);
  store = store.filter((i) => i.id !== id);
};
