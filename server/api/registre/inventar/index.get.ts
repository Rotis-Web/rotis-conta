import { RegistruInventar } from "../../../models/RegistruInventar";
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

  const entries = await RegistruInventar.find({
    userId: user._id,
    an: an || new Date().getFullYear(),
  })
    .sort({ data: 1, nrCrt: 1 })
    .lean();

  const totals = entries.reduce(
    (acc, entry: any) => {
      acc.valoareContabila += entry.valoareContabila;
      acc.valoareCirculatie += entry.valoareCirculatie;
      acc.diferenteValoare += entry.diferenteEvaluare.valoare;
      return acc;
    },
    {
      valoareContabila: 0,
      valoareCirculatie: 0,
      diferenteValoare: 0,
    }
  );

  return {
    entries,
    totals,
    an: an || new Date().getFullYear(),
  };
});
