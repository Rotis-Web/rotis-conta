import { User } from "../../models/User";
import { Factura } from "../../models/Factura";
import { IntrareIesire } from "../../models/IntrareIesire";
import { IncasarePlata } from "../../models/IncasarePlata";
import { Document } from "../../models/Document";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({ statusCode: 401, message: "Neautentificat" });
  }

  const userId = user._id;

  await Promise.all([
    Factura.deleteMany({ userId }),
    IntrareIesire.deleteMany({ userId }),
    IncasarePlata.deleteMany({ userId }),
    Document.deleteMany({ userId }),
  ]);

  await User.deleteOne({ _id: userId });

  deleteCookie(event, "auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return { success: true };
});
