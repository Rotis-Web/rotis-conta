import { IntrareIesire } from "../../../models/IntrareIesire";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const entry = await IntrareIesire.findOne({
    _id: id,
    userId: user._id,
  });

  if (!entry) {
    throw createError({
      statusCode: 404,
      message: "Intrarea nu a fost găsită",
    });
  }

  if (body.dataInregistrarii) {
    entry.dataInregistrarii = new Date(body.dataInregistrarii);
    entry.an = entry.dataInregistrarii.getFullYear();
  }

  if (body.nrSiDataDocument) entry.nrSiDataDocument = body.nrSiDataDocument;
  if (body.emitent) entry.emitent = body.emitent;
  if (body.continutPeScurt) entry.continutPeScurt = body.continutPeScurt;
  if (body.compartimentSiSemnatura)
    entry.compartimentSiSemnatura = body.compartimentSiSemnatura;
  if (body.dataExpedierii) entry.dataExpedierii = new Date(body.dataExpedierii);
  if (body.destinatar) entry.destinatar = body.destinatar;
  if (body.nrInregistrareLaCare)
    entry.nrInregistrareLaCare = body.nrInregistrareLaCare;

  await entry.save();

  return {
    success: true,
    entry,
  };
});
