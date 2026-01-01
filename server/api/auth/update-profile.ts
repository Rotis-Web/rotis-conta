import { User } from "../../models/User";
import { validateBody, updateUserSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const { nume, email } = await validateBody(event, updateUserSchema);

  if (email !== user.email) {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email-ul este deja utilizat de alt cont",
      });
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { nume, email },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw createError({
      statusCode: 404,
      message: "Utilizatorul nu a fost găsit",
    });
  }

  return {
    success: true,
    user: {
      id: updatedUser._id,
      email: updatedUser.email,
      nume: updatedUser.nume,
      pfaData: updatedUser.pfaData,
    },
  };
});
