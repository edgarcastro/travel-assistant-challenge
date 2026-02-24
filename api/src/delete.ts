export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        action: "delete",
        message: "Delete travel wishlist item - dummy response",
        input: event,
      },
      null,
      2,
    ),
  };
};
