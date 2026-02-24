export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        action: "read",
        message: "Read travel wishlist item(s) - dummy response",
        input: event,
      },
      null,
      2,
    ),
  };
};
