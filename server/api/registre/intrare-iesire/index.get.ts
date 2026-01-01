import { IntrareIesire } from "../../../models/IntrareIesire";
import { validateQuery, yearQuerySchema } from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const { an } = validateQuery(event, yearQuerySchema);

  const entries = await IntrareIesire.find({
    userId: user._id,
    an: an || new Date().getFullYear(),
  })
    .sort({ dataInregistrarii: 1, nrInregistrare: 1 })
    .lean();

  return {
    entries,
    an: an || new Date().getFullYear(),
    total: entries.length,
  };
});
