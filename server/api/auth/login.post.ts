import { User } from "../../models/User";
import { generateToken } from "../../utils/jwt";
import { validateBody, loginSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const { email, password } = await validateBody(event, loginSchema);

  const user = await User.findOne({ email });
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Email sau parolă incorectă",
    });
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: "Email sau parolă incorectă",
    });
  }

  const token = generateToken(user._id.toString());

  setCookie(event, "auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return {
    success: true,
    user: {
      id: user._id,
      email: user.email,
      nume: user.nume,
      pfaData: user.pfaData,
    },
    token,
  };
});
