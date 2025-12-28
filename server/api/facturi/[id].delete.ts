import { Factura } from "../../models/Factura";
import { del } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const id = getRouterParam(event, "id");

  const factura = await Factura.findOne({
    _id: id,
    userId: user._id,
  });

  if (!factura) {
    throw createError({
      statusCode: 404,
      message: "Factura nu a fost găsită",
    });
  }

  if (factura.fisier?.url) {
    try {
      await del(factura.fisier.url);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  await factura.deleteOne();

  return {
    success: true,
    message: "Factura a fost ștearsă",
  };
});
