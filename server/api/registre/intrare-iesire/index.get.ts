import { IntrareIesire } from "../../../models/IntrareIesire";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const query = getQuery(event);

  const an = query.an ? parseInt(query.an as string) : new Date().getFullYear();

  const entries = await IntrareIesire.find({
    userId: user._id,
    an,
  })
    .sort({ dataInregistrarii: 1, nrInregistrare: 1 })
    .lean();

  return {
    entries,
    an,
    total: entries.length,
  };
});
