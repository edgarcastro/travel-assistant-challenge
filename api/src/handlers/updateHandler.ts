import { z } from "zod";
import { getUser } from "../utils/getUser";
import { updateData } from "../data/updateData";
import type { UpdateTravelResponse } from "shared";

const schema = z
  .object({
    priority: z.enum(["low", "medium", "high"]).optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.priority !== undefined || data.notes !== undefined, {
    message: "At least one field (priority or notes) must be provided",
  });

export const handler = async (event: any) => {
  try {
    const userId = getUser(event);
    const urlId: string = event.pathParameters?.id;
    const dbId = urlId.replace("-", "#");

    const parsed = schema.safeParse(JSON.parse(event.body ?? "{}"));

    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: parsed.error.issues }),
      };
    }

    const updated: UpdateTravelResponse = await updateData(
      userId,
      dbId,
      parsed.data,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updated),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
