import { RegistruInventar } from "../../../models/RegistruInventar";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const query = getQuery(event);

  const an = query.an ? parseInt(query.an as string) : new Date().getFullYear();

  const entries = await RegistruInventar.find({
    userId: user._id,
    an,
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
    an,
  };
});
