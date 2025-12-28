import { IncasarePlata } from "../../../models/IncasarePlata";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);

  if (!body.data || !body.felulOperatiunii || !body.tip || !body.suma) {
    throw createError({
      statusCode: 400,
      message: "Date incomplete",
    });
  }

  const data = new Date(body.data);
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
    document: body.document,
    felulOperatiunii: body.felulOperatiunii,
    tip: body.tip,
    suma: body.suma,
    banca: body.banca,
    an,
    luna,
  });

  return {
    success: true,
    entry,
  };
});
