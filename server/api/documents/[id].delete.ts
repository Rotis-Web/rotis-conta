import { del } from "@vercel/blob";
import { Document } from "../../models/Document";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const id = getRouterParam(event, "id");

  const document = await Document.findOne({
    _id: id,
    userId: user._id,
  });

  if (!document) {
    throw createError({
      statusCode: 404,
      message: "Documentul nu a fost găsit",
    });
  }

  try {
    if (document.fisier?.url) {
      await del(document.fisier.url);
    }

    await document.deleteOne();

    return {
      success: true,
      message: "Document șters cu succes",
    };
  } catch (error) {
    console.error("Delete error:", error);
    throw createError({
      statusCode: 500,
      message: "Eroare la ștergere document",
    });
  }
});
