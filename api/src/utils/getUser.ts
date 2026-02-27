export function getUser(event: any): string {
  const userId = event.headers?.["x-user-id"] ?? event.headers?.["X-User-Id"];
  if (!userId) throw new Error("Missing x-user-id header");
  return userId;
  //TODO: return event.requestContext.authorizer.jwt.claims.email;
}
