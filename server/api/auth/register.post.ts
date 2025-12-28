import { User } from "../../models/User";
import { generateToken } from "../../utils/jwt";

export default defineEventHandler(async (event) => {
  const { email, password, nume, pfaData } = await readBody(event);

  if (!email || !password || !nume) {
    throw createError({
      statusCode: 400,
      message: "Email, parolă și nume sunt obligatorii",
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
