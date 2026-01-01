import { IntrareIesire } from "../../../models/IntrareIesire";
import { validateBody, intrareIesireSchema } from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const validatedData = await validateBody(event, intrareIesireSchema);

  const dataInregistrarii = new Date(validatedData.dataInregistrarii);
  const an = dataInregistrarii.getFullYear();

  const lastEntry = await IntrareIesire.findOne({
    userId: user._id,
    an,
  })
    .sort({ nrInregistrare: -1 })
    .lean();

  const nrInregistrare = lastEntry ? lastEntry.nrInregistrare + 1 : 1;

  const entry = await IntrareIesire.create({
    userId: user._id,
    nrInregistrare,
    dataInregistrarii,
    nrSiDataDocument: validatedData.nrSiDataDocument,
    emitent: validatedData.emitent,
    continutPeScurt: validatedData.continutPeScurt,
    compartimentSiSemnatura: validatedData.compartimentSiSemnatura,
    dataExpedierii: validatedData.dataExpedierii
      ? new Date(validatedData.dataExpedierii)
      : undefined,
    destinatar: validatedData.destinatar,
    nrInregistrareLaCare: validatedData.nrInregistrareLaCare,
    an,
  });

  return {
    success: true,
    entry,
  };
});
