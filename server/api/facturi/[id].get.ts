import { Factura } from "../../models/Factura";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const id = getRouterParam(event, "id");

  const factura = await Factura.findOne({
    _id: id,
    userId: user._id,
  }).lean();

  if (!factura) {
    throw createError({
      statusCode: 404,
      message: "Factura nu a fost găsită",
    });
  }

  return {
    factura,
  };
});
