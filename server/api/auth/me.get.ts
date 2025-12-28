export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  return {
    user: {
      id: user._id,
      email: user.email,
      nume: user.nume,
      pfaData: user.pfaData,
    },
  };
});
