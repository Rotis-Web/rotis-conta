import { Factura } from "../../models/Factura";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const body = await readBody(event);

  if (!body.tip || !body.numarFactura || !body.data || !body.total) {
    throw createError({
      statusCode: 400,
      message: "Date incomplete",
    });
  }

  const data = new Date(body.data);
  const factura = await Factura.create({
    userId: user._id,
    ...body,
    data,
    an: data.getFullYear(),
    luna: data.getMonth() + 1,
  });

  return { success: true, factura };
});
