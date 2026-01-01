import { Document } from "../../models/Document";
import { validateQuery, documentQuerySchema } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const { tip } = validateQuery(event, documentQuerySchema);

  const filter: any = { userId: user._id };

  if (tip) {
    filter.tip = tip;
  }

  const documents = await Document.find(filter)
    .sort({ data: -1, createdAt: -1 })
    .lean();

  return {
    documents,
    total: documents.length,
  };
});
