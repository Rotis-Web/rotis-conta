import { RegistruInventar } from "../../../models/RegistruInventar";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);

  if (!body.elementeInventariate || !body.data) {
    throw createError({
      statusCode: 400,
      message: "Date incomplete",
    });
  }

  const data = new Date(body.data);
  const an = data.getFullYear();

  const lastEntry = await RegistruInventar.findOne({
    userId: user._id,
    an,
  })
    .sort({ nrCrt: -1 })
    .lean();

  const nrCrt = lastEntry ? lastEntry.nrCrt + 1 : 1;

  const valoareContabila = body.valoareContabila || 0;
  const valoareCirculatie = body.valoareCirculatie || 0;
  const diferentaValoare = valoareCirculatie - valoareContabila;

  const entry = await RegistruInventar.create({
    userId: user._id,
    nrCrt,
    elementeInventariate: body.elementeInventariate,
    valoareContabila,
    valoareCirculatie,
    diferenteEvaluare: {
      valoare: diferentaValoare,
      cauze: body.diferenteEvaluare?.cauze || "",
    },
    data,
    an,
  });

  return {
    success: true,
    entry,
  };
});
