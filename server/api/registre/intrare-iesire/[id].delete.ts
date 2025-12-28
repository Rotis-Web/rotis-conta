import { IntrareIesire } from "../../../models/IntrareIesire";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const id = getRouterParam(event, "id");

  const entry = await IntrareIesire.findOneAndDelete({
    _id: id,
    userId: user._id,
  });

  if (!entry) {
    throw createError({
      statusCode: 404,
      message: "Intrarea nu a fost găsită",
    });
  }

  return {
    success: true,
    message: "Intrarea a fost ștearsă",
  };
});
