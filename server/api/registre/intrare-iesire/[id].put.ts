import { IntrareIesire } from "../../../models/IntrareIesire";
import {
  validateBody,
  validateMongoId,
  intrareIesireUpdateSchema,
} from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const id = validateMongoId(event, "id");

  const validatedData = await validateBody(event, intrareIesireUpdateSchema);

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

  if (validatedData.dataInregistrarii) {
    const newData = new Date(validatedData.dataInregistrarii);
    entry.dataInregistrarii = newData;
    entry.an = newData.getFullYear();
  }

  if (validatedData.nrSiDataDocument !== undefined) {
    entry.nrSiDataDocument = validatedData.nrSiDataDocument;
  }
  if (validatedData.emitent !== undefined) {
    entry.emitent = validatedData.emitent;
  }
  if (validatedData.continutPeScurt !== undefined) {
    entry.continutPeScurt = validatedData.continutPeScurt;
  }
  if (validatedData.compartimentSiSemnatura !== undefined) {
    entry.compartimentSiSemnatura = validatedData.compartimentSiSemnatura;
  }
  if (validatedData.dataExpedierii !== undefined) {
    entry.dataExpedierii = validatedData.dataExpedierii
      ? new Date(validatedData.dataExpedierii)
      : undefined;
  }
  if (validatedData.destinatar !== undefined) {
    entry.destinatar = validatedData.destinatar;
  }
  if (validatedData.nrInregistrareLaCare !== undefined) {
    entry.nrInregistrareLaCare = validatedData.nrInregistrareLaCare;
  }

  await entry.save();

  return {
    success: true,
    entry,
  };
});
