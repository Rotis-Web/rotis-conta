import { IncasarePlata } from "../../../models/IncasarePlata";
import { validateBody, incasarePlataSchema } from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const validatedData = await validateBody(event, incasarePlataSchema);

  const data = new Date(validatedData.data);
  const an = data.getFullYear();
  const luna = data.getMonth() + 1;

  const lastEntry = await IncasarePlata.findOne({
    userId: user._id,
    an,
  })
    .sort({ nrCrt: -1 })
    .lean();

  const nrCrt = lastEntry ? lastEntry.nrCrt + 1 : 1;

  const entry = await IncasarePlata.create({
    userId: user._id,
    nrCrt,
    data,
    document: validatedData.document,
    felulOperatiunii: validatedData.felulOperatiunii,
    tip: validatedData.tip,
    suma: validatedData.suma,
    metodaPlata: validatedData.metodaPlata,
    an,
    luna,
  });

  return {
    success: true,
    entry,
  };
});
