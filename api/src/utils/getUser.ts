export function getUser(event: any): string {
  if (process.env.IS_OFFLINE) {
    const userId = event.headers?.["x-user-id"] ?? event.headers?.["X-User-Id"];
    if (!userId) throw new Error("Missing x-user-id header");
    return userId;
  }
  const email = event.requestContext?.authorizer?.jwt?.claims?.email;
  if (!email) throw new Error("Unauthorized");
  return email;
}
