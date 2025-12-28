import { IntrareIesire } from "../../../models/IntrareIesire";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);

  if (!body.dataInregistrarii || !body.continutPeScurt) {
    throw createError({
      statusCode: 400,
      message: "Date incomplete",
    });
  }

  const dataInregistrarii = new Date(body.dataInregistrarii);
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
    nrSiDataDocument: body.nrSiDataDocument,
    emitent: body.emitent,
    continutPeScurt: body.continutPeScurt,
    compartimentSiSemnatura: body.compartimentSiSemnatura,
    dataExpedierii: body.dataExpedierii
      ? new Date(body.dataExpedierii)
      : undefined,
    destinatar: body.destinatar,
    nrInregistrareLaCare: body.nrInregistrareLaCare,
    an,
  });

  return {
    success: true,
    entry,
  };
});
