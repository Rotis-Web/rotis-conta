import { User } from "../../models/User";
import { validateBody, updatePFADataSchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const { pfaData } = await validateBody(event, updatePFADataSchema);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { pfaData },
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
    pfaData: updatedUser.pfaData,
  };
});
