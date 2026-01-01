import { IntrareIesire } from "../../../models/IntrareIesire";
import { validateMongoId } from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const id = validateMongoId(event, "id");

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
