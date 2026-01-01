import { User } from "../../models/User";
import { validateBody, changePasswordSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const { currentPassword, newPassword } = await validateBody(
    event,
    changePasswordSchema
  );

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
