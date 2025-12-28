import { Factura } from "../../models/Factura";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

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

  Object.keys(body).forEach((key) => {
    if (key !== "_id" && key !== "userId") {
      factura[key] = body[key];
    }
  });

  if (body.data) {
    factura.data = new Date(body.data);
    factura.an = factura.data.getFullYear();
    factura.luna = factura.data.getMonth() + 1;
  }

  await factura.save();

  return {
    success: true,
    factura,
  };
});
