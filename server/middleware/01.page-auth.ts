import { verifyToken } from "../utils/jwt";

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_nuxt") ||
    pathname.startsWith("/__nuxt") ||
    pathname.includes(".")
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
    "/setari",
  ];

  const authRoutes = ["/login", "/register"];

  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isHome = pathname === "/";

  let isAuthenticated = false;
  if (token) {
    try {
      const decoded = verifyToken(token);
      isAuthenticated = !!decoded;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isProtectedRoute && !isAuthenticated) {
    return sendRedirect(event, "/login", 302);
  }

  if ((isAuthRoute || isHome) && isAuthenticated) {
    return sendRedirect(event, "/dashboard", 302);
  }

  event.context.isAuthenticated = isAuthenticated;
});
