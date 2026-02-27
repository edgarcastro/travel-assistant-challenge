import { getUser } from "../utils/getUser";
import { deleteData } from "../data/deleteData";

export const handler = async (event: any) => {
  try {
    const userId = getUser(event);
    const urlId: string = event.pathParameters?.id;
    const dbId = urlId.replace("-", "#");

    await deleteData(userId, dbId);

    return {
      statusCode: 204,
      body: "",
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
