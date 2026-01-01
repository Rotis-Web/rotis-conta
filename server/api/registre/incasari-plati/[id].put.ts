import { IncasarePlata } from "../../../models/IncasarePlata";
import {
  validateBody,
  validateMongoId,
  incasarePlataUpdateSchema,
} from "../../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const id = validateMongoId(event, "id");
  const validatedData = await validateBody(event, incasarePlataUpdateSchema);

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

  if (validatedData.data) {
    const newData = new Date(validatedData.data);
    entry.data = newData;
    entry.an = newData.getFullYear();
    entry.luna = newData.getMonth() + 1;
  }

  if (validatedData.document !== undefined)
    entry.document = validatedData.document;
  if (validatedData.felulOperatiunii !== undefined)
    entry.felulOperatiunii = validatedData.felulOperatiunii;
  if (validatedData.tip !== undefined) entry.tip = validatedData.tip;
  if (validatedData.suma !== undefined) entry.suma = validatedData.suma;
  if (validatedData.metodaPlata !== undefined)
    entry.metodaPlata = validatedData.metodaPlata;

  await entry.save();

  return {
    success: true,
    entry,
  };
});
