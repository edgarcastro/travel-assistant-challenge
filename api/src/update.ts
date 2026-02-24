export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        action: "update",
        message: "Update travel wishlist item - dummy response",
        input: event,
      },
      null,
      2,
    ),
  };
};
