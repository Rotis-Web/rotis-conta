import { User } from "../../models/User";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const { pfaData } = await readBody(event);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { pfaData },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    throw createError({
      statusCode: 404,
      message: "User nu a fost găsit",
    });
  }

  return {
    success: true,
    pfaData: updatedUser.pfaData,
  };
});
