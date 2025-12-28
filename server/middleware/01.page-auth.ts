import { verifyToken } from "../utils/jwt";

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || "";

  // Only handle page requests (not API, not static files)
  if (
    url.startsWith("/api") ||
    url.startsWith("/_nuxt") ||
    url.includes(".") ||
    url.startsWith("/__nuxt")
  ) {
    return;
  }

  const token = getCookie(event, "auth_token");

  const protectedRoutes = [
    "/dashboard",
    "/registre",
    "/facturi",
    "/documente",
    "/calculator",
  ];
  const authRoutes = ["/login", "/register"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    url.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => url.startsWith(route));

  let isAuthenticated = false;
  if (token) {
    try {
      const decoded = verifyToken(token);
      isAuthenticated = !!decoded;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    return sendRedirect(event, "/login", 302);
  }

  if (isAuthRoute && isAuthenticated) {
    return sendRedirect(event, "/dashboard", 302);
  }

  event.context.isAuthenticated = isAuthenticated;
});
