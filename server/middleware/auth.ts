import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_REQUESTS = 100;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000);

export default defineEventHandler(async (event) => {
  const publicPaths = ["/api/auth/login", "/api/auth/register"];
  if (publicPaths.some((path) => event.path.startsWith(path))) {
    return;
  }

  if (!event.path.startsWith("/api/")) {
    return;
  }

  const clientIp =
    getHeader(event, "x-forwarded-for")?.split(",")[0] ||
    getHeader(event, "x-real-ip") ||
    event.node.req.socket.remoteAddress ||
    "unknown";

  if (!checkRateLimit(clientIp)) {
    throw createError({
      statusCode: 429,
      message:
        "Prea multe cereri. Vă rugăm să așteptați și să încercați din nou.",
    });
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

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Token invalid sau expirat",
    });
  }

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
      message: "Utilizatorul nu a fost găsit",
    });
  }

  event.context.user = user;
});
