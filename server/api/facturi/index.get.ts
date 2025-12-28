import { Factura } from "../../models/Factura";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const query = getQuery(event);

  const filter: any = { userId: user._id };

  if (query.tip) filter.tip = query.tip;
  if (query.an) filter.an = parseInt(query.an as string);
  if (query.status) filter.status = query.status;

  const facturi = await Factura.find(filter).sort({ data: -1 }).lean();

  const totals = {
    total: 0,
    platite: 0,
    neplatite: 0,
    count: facturi.length,
  };

  facturi.forEach((f: any) => {
    totals.total += f.total;
    if (f.status === "platita") totals.platite += f.total;
    else totals.neplatite += f.total;
  });

  return { facturi, totals };
});
