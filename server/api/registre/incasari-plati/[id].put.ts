import { IncasarePlata } from "../../../models/IncasarePlata";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const entry = await IncasarePlata.findOne({
    _id: id,
    userId: user._id,
  });

  if (!entry) {
    throw createError({
      statusCode: 404,
      message: "Intrarea nu a fost găsită",
    });
  }

  if (body.data) {
    entry.data = new Date(body.data);
    entry.an = entry.data.getFullYear();
    entry.luna = entry.data.getMonth() + 1;
  }

  if (body.document) entry.document = body.document;
  if (body.felulOperatiunii) entry.felulOperatiunii = body.felulOperatiunii;
  if (body.tip) entry.tip = body.tip;
  if (body.suma !== undefined) entry.suma = body.suma;
  if (body.banca) entry.banca = body.banca;

  await entry.save();

  return {
    success: true,
    entry,
  };
});
