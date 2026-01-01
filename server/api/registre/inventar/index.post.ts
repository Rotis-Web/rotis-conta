import { RegistruInventar } from "../../../models/RegistruInventar";
import {
  validateBody,
  registruInventarSchema,
} from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const validatedData = await validateBody(event, registruInventarSchema);

  const data = new Date(validatedData.data);
  const an = data.getFullYear();

  const lastEntry = await RegistruInventar.findOne({
    userId: user._id,
    an,
  })
    .sort({ nrCrt: -1 })
    .lean();

  const nrCrt = lastEntry ? lastEntry.nrCrt + 1 : 1;

  const valoareContabila = validatedData.valoareContabila || 0;
  const valoareCirculatie = validatedData.valoareCirculatie || 0;
  const diferentaValoare = valoareCirculatie - valoareContabila;

  const entry = await RegistruInventar.create({
    userId: user._id,
    nrCrt,
    elementeInventariate: validatedData.elementeInventariate,
    valoareContabila,
    valoareCirculatie,
    diferenteEvaluare: {
      valoare: diferentaValoare,
      cauze: validatedData.diferenteEvaluare?.cauze || "",
    },
    data,
    an,
  });

  return {
    success: true,
    entry,
  };
});
