import { z } from "zod";
import { getUser } from "../utils/getUser";
import { createData } from "../data/createData";
import type { CreateTravelResponse } from "shared";

const schema = z.object({
  countryCode: z.string().min(1),
  city: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]).optional(),
  notes: z.string().optional(),
});

export const handler = async (event: any) => {
  try {
    const userId = getUser(event);
    const parsed = schema.safeParse(JSON.parse(event.body ?? "{}"));

    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: parsed.error.issues }),
      };
    }

    const { countryCode, city, priority, notes } = parsed.data;
    const now = new Date().toISOString();
    const dbId = `${countryCode}#${city}`;

    const item: CreateTravelResponse = await createData({
      id: dbId,
      userId,
      countryCode,
      city,
      priority,
      notes,
      createdAt: now,
      updatedAt: now,
    });

    return {
      statusCode: 201,
      body: JSON.stringify(item),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
