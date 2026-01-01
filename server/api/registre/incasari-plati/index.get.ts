import { IncasarePlata } from "../../../models/IncasarePlata";
import { validateQuery, yearQuerySchema } from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const { an, luna } = validateQuery(event, yearQuerySchema);

  const dbQuery: any = {
    userId: user._id,
    an: an || new Date().getFullYear(),
  };

  if (luna) {
    dbQuery.luna = luna;
  }

  const entries = await IncasarePlata.find(dbQuery)
    .sort({ data: 1, nrCrt: 1 })
    .lean();

  const totals = {
    incasari: 0,
    plati: 0,
    sold: 0,
  };

  const byMonth: any = {};

  entries.forEach((entry: any) => {
    if (entry.tip === "incasare") {
      totals.incasari += entry.suma;
    } else {
      totals.plati += entry.suma;
    }

    if (!byMonth[entry.luna]) {
      byMonth[entry.luna] = {
        luna: entry.luna,
        incasari: 0,
        plati: 0,
        sold: 0,
      };
    }

    if (entry.tip === "incasare") {
      byMonth[entry.luna].incasari += entry.suma;
    } else {
      byMonth[entry.luna].plati += entry.suma;
    }

    byMonth[entry.luna].sold =
      byMonth[entry.luna].incasari - byMonth[entry.luna].plati;
  });

  totals.sold = totals.incasari - totals.plati;

  return {
    entries,
    totals,
    byMonth: Object.values(byMonth),
    an: dbQuery.an,
  };
});
