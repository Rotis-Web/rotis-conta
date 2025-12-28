import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";

export default defineEventHandler(async (event) => {
  const publicPaths = ["/api/auth/login", "/api/auth/register"];
  if (publicPaths.some((path) => event.path.startsWith(path))) {
    return;
  }
  if (!event.path.startsWith("/api/")) {
    return;
  }
  const token =
    getCookie(event, "auth_token") ||
    getHeader(event, "authorization")?.replace("Bearer ", "");
  if (!token) {
    throw createError({
      statusCode: 401,
      message: "Token lipsă - autentificare necesară",
    });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    throw createError({
      statusCode: 401,
      message: "Token invalid sau expirat",
    });
  }
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "User nu a fost găsit",
    });
  }
  event.context.user = user;
});
