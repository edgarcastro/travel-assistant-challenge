import { getUser } from "../utils/getUser";
import { readData } from "../data/readData";
import type { GetTravelsResponse } from "shared";

export const handler = async (event: any) => {
  try {
    const userId = getUser(event);
    const items: GetTravelsResponse = await readData(userId);

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
