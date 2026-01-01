import { User } from "../../models/User";
import { generateToken } from "../../utils/jwt";
import { validateBody, registerSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const { email, password, nume, pfaData } = await validateBody(
    event,
    registerSchema
  );

  const userCount = await User.countDocuments();
  if (userCount > 0) {
    throw createError({
      statusCode: 403,
      message:
        "Înregistrarea este dezactivată. Aplicația permite un singur cont.",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: "Email-ul este deja înregistrat",
    });
  }

  const user = await User.create({
    email,
    password,
    nume,
    pfaData: pfaData || {},
  });

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
