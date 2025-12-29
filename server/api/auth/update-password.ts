import { User } from "../../models/User";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const { currentPassword, newPassword } = await readBody(event);

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      message: "Parola curentă și parola nouă sunt obligatorii",
    });
  }

  if (newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      message: "Parola nouă trebuie să aibă cel puțin 6 caractere",
    });
  }

  const userWithPassword = await User.findById(user._id);

  if (!userWithPassword) {
    throw createError({
      statusCode: 404,
      message: "Utilizatorul nu a fost găsit",
    });
  }

  const isValidPassword = await userWithPassword.comparePassword(
    currentPassword
  );

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: "Parola curentă este incorectă",
    });
  }

  userWithPassword.password = newPassword;
  await userWithPassword.save();

  return {
    success: true,
    message: "Parola a fost schimbată cu succes",
  };
});
