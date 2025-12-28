import { Document } from "../../models/Document";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const query = getQuery(event);

  const filter: any = { userId: user._id };

  if (query.tip) {
    filter.tip = query.tip;
  }

  const documents = await Document.find(filter)
    .sort({ data: -1, createdAt: -1 })
    .lean();

  return {
    documents,
    total: documents.length,
  };
});
