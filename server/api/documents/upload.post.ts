import { put } from "@vercel/blob";
import { Document } from "../../models/Document";
import { validateFileUpload } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Neautentificat",
    });
  }

  const formData = await readMultipartFormData(event);

  if (!formData) {
    throw createError({
      statusCode: 400,
      message: "Nu s-a primit niciun fișier",
    });
  }

  const validatedData = validateFileUpload(formData);

  try {
    const blob = await put(
      validatedData.file.filename,
      validatedData.file.data,
      {
        access: "public",
        addRandomSuffix: true,
      }
    );

    const document = await Document.create({
      userId: user._id,
      tip: validatedData.tip,
      titlu: validatedData.titlu,
      descriere: validatedData.descriere,
      data: validatedData.data,
      fisier: {
        url: blob.url,
        key: blob.pathname,
        nume: validatedData.file.filename,
        marime: validatedData.file.data.length,
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
