import { put } from "@vercel/blob";
import { Document } from "../../models/Document";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const formData = await readMultipartFormData(event);

  if (!formData) {
    throw createError({
      statusCode: 400,
      message: "Nu s-a primit niciun fișier",
    });
  }

  const fileData = formData.find((item) => item.name === "file");
  const tip = formData.find((item) => item.name === "tip")?.data.toString();
  const titlu = formData.find((item) => item.name === "titlu")?.data.toString();
  const descriere = formData
    .find((item) => item.name === "descriere")
    ?.data.toString();
  const data = formData.find((item) => item.name === "data")?.data.toString();

  if (!fileData || !tip || !titlu) {
    throw createError({
      statusCode: 400,
      message: "Date incomplete",
    });
  }

  try {
    const blob = await put(fileData.filename!, fileData.data, {
      access: "public",
      addRandomSuffix: true,
    });

    const document = await Document.create({
      userId: user._id,
      tip,
      titlu,
      descriere: descriere || "",
      data: data ? new Date(data) : new Date(),
      fisier: {
        url: blob.url,
        key: blob.pathname,
        nume: fileData.filename,
        marime: fileData.data.length,
      },
    });

    return {
      success: true,
      document,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw createError({
      statusCode: 500,
      message: "Eroare la încărcare fișier",
    });
  }
});
