import { z } from "zod";
import type { H3Event } from "h3";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email invalid")
    .min(1, "Email-ul este obligatoriu")
    .max(255, "Email-ul este prea lung")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Parola trebuie să aibă cel puțin 6 caractere")
    .max(128, "Parola este prea lungă"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .email("Email invalid")
    .min(1, "Email-ul este obligatoriu")
    .max(255, "Email-ul este prea lung")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "Parola trebuie să aibă cel puțin 6 caractere")
    .max(128, "Parola este prea lungă"),
  nume: z
    .string()
    .min(1, "Numele este obligatoriu")
    .max(255, "Numele este prea lung")
    .trim(),
  pfaData: z
    .object({
      denumire: z.string().max(255).optional(),
      cui: z.string().max(50).optional(),
      nrRegCom: z.string().max(50).optional(),
      adresa: z.string().max(500).optional(),
      telefon: z.string().max(50).optional(),
      email: z.string().email().max(255).optional().or(z.literal("")),
      banca: z.string().max(255).optional(),
      iban: z.string().max(50).optional(),
      caen: z.string().max(50).optional(),
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Parola curentă este obligatorie")
    .max(128),
  newPassword: z
    .string()
    .min(6, "Parola nouă trebuie să aibă cel puțin 6 caractere")
    .max(128, "Parola este prea lungă"),
});

export const updateUserSchema = z.object({
  nume: z
    .string()
    .min(1, "Numele este obligatoriu")
    .max(255, "Numele este prea lung")
    .trim(),
  email: z
    .string()
    .email("Email invalid")
    .min(1, "Email-ul este obligatoriu")
    .max(255, "Email-ul este prea lung")
    .toLowerCase()
    .trim(),
});

export const updatePFADataSchema = z.object({
  pfaData: z.object({
    denumire: z.string().max(255).optional(),
    cui: z.string().max(50).optional(),
    nrRegCom: z.string().max(50).optional(),
    adresa: z.string().max(500).optional(),
    telefon: z.string().max(50).optional(),
    email: z.string().email().max(255).optional().or(z.literal("")),
    banca: z.string().max(255).optional(),
    iban: z.string().max(50).optional(),
    caen: z.string().max(50).optional(),
  }),
});

export const incasarePlataSchema = z.object({
  data: z
    .string()
    .min(1, "Data este obligatorie")
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("Data invalidă");
      }
      return date.toISOString();
    }),
  document: z
    .object({
      tip: z.string().max(100).trim(),
      numar: z.string().max(100).trim(),
    })
    .optional(),
  felulOperatiunii: z
    .string()
    .min(1, "Felul operațiunii este obligatoriu")
    .max(255)
    .trim(),
  tip: z.enum(["incasare", "plata"], {
    message: "Tipul trebuie să fie 'incasare' sau 'plata'",
  }),
  suma: z
    .number()
    .min(0, "Suma nu poate fi negativă")
    .max(999999999.99, "Suma este prea mare"),
  metodaPlata: z.enum(["banca", "numerar"], {
    message: "Metoda de plată trebuie să fie 'banca' sau 'numerar'",
  }),
});

export const incasarePlataUpdateSchema = incasarePlataSchema.partial();

export const intrareIesireSchema = z.object({
  dataInregistrarii: z
    .string()
    .min(1, "Data este obligatorie")
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("Data invalidă");
      }
      return date.toISOString();
    }),
  nrSiDataDocument: z
    .object({
      numar: z.string().max(100).trim(),
      data: z
        .string()
        .min(1, "Data este obligatorie")
        .transform((val) => {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error("Data invalidă");
          }
          return date.toISOString();
        }),
    })
    .optional(),
  emitent: z.string().max(255).trim().optional(),
  continutPeScurt: z
    .string()
    .min(1, "Conținutul pe scurt este obligatoriu")
    .max(1000)
    .trim(),
  compartimentSiSemnatura: z.string().max(255).trim().optional(),
  dataExpedierii: z
    .string()
    .min(1, "Data este obligatorie")
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("Data invalidă");
      }
      return date.toISOString();
    }),
  destinatar: z.string().max(255).trim().optional(),
  nrInregistrareLaCare: z.string().max(100).trim().optional(),
});

export const intrareIesireUpdateSchema = intrareIesireSchema.partial();

export const registruInventarSchema = z.object({
  elementeInventariate: z
    .string()
    .min(1, "Elementele inventariate sunt obligatorii")
    .max(500)
    .trim(),
  valoareContabila: z
    .number()
    .min(0, "Valoarea contabilă nu poate fi negativă")
    .max(999999999.99, "Valoarea este prea mare")
    .default(0),
  valoareCirculatie: z
    .number()
    .min(0, "Valoarea de circulație nu poate fi negativă")
    .max(999999999.99, "Valoarea este prea mare")
    .default(0),
  diferenteEvaluare: z
    .object({
      cauze: z.string().max(500).trim().optional(),
    })
    .optional(),
  data: z
    .string()
    .min(1, "Data este obligatorie")
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        throw new Error("Data invalidă");
      }
      return date.toISOString();
    }),
});

export const documentQuerySchema = z.object({
  tip: z
    .enum([
      "contract",
      "extras",
      "declaratie",
      "plati-impozite",
      "divers",
      "factura-emisa",
      "factura-primita",
    ])
    .optional(),
});

export const yearQuerySchema = z.object({
  an: z
    .string()
    .regex(/^\d{4}$/, "Anul trebuie să fie un număr valid de 4 cifre")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 2000 && val <= 2100, {
      message: "Anul trebuie să fie între 2000 și 2100",
    })
    .optional(),
  luna: z
    .string()
    .regex(/^(1[0-2]|[1-9])$/, "Luna trebuie să fie între 1 și 12")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val >= 1 && val <= 12, {
      message: "Luna trebuie să fie între 1 și 12",
    })
    .optional(),
});

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "ID invalid");

export async function validateBody<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await readBody(event);
    return await schema.parseAsync(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw createError({
        statusCode: 400,
        message: firstError.message || "Date invalide",
        data: {
          field: firstError.path.join("."),
          issues: error.issues,
        },
      });
    }
    throw createError({
      statusCode: 400,
      message: "Date invalide",
    });
  }
}

export function validateQuery<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T
): z.infer<T> {
  try {
    const query = getQuery(event);
    return schema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw createError({
        statusCode: 400,
        message: firstError.message || "Parametri invalizi",
        data: {
          field: firstError.path.join("."),
          issues: error.issues,
        },
      });
    }
    throw createError({
      statusCode: 400,
      message: "Parametri invalizi",
    });
  }
}

export function validateMongoId(event: H3Event, paramName: string): string {
  const id = getRouterParam(event, paramName);

  if (!id) {
    throw createError({
      statusCode: 400,
      message: `Parametrul ${paramName} este obligatoriu`,
    });
  }

  try {
    return mongoIdSchema.parse(id);
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: "ID invalid",
    });
  }
}

export function sanitizeString(input: string): string {
  if (!input) return "";

  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

export function validateFileUpload(formData: any[]) {
  const fileData = formData.find((item) => item.name === "file");
  const tip = formData.find((item) => item.name === "tip")?.data.toString();
  const titlu = formData.find((item) => item.name === "titlu")?.data.toString();
  const descriere = formData
    .find((item) => item.name === "descriere")
    ?.data.toString();
  const data = formData.find((item) => item.name === "data")?.data.toString();

  if (!fileData || !fileData.filename) {
    throw createError({
      statusCode: 400,
      message: "Fișierul este obligatoriu",
    });
  }

  const maxSize = 10 * 1024 * 1024;
  if (fileData.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      message: "Fișierul este prea mare (max 10MB)",
    });
  }

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.ms-excel",
  ];

  if (fileData.type && !allowedTypes.includes(fileData.type)) {
    throw createError({
      statusCode: 400,
      message:
        "Tip de fișier invalid. Tipuri permise: PDF, imagini, Word, Excel",
    });
  }

  const sanitizedFilename = sanitizeString(fileData.filename);
  if (!sanitizedFilename || sanitizedFilename.length > 255) {
    throw createError({
      statusCode: 400,
      message: "Nume de fișier invalid",
    });
  }

  const validTips = [
    "contract",
    "extras",
    "declaratie",
    "plati-impozite",
    "divers",
    "factura-emisa",
    "factura-primita",
  ];
  if (!tip || !validTips.includes(tip)) {
    throw createError({
      statusCode: 400,
      message: "Tipul documentului este invalid",
    });
  }

  if (!titlu || titlu.trim().length === 0 || titlu.length > 255) {
    throw createError({
      statusCode: 400,
      message: "Titlul documentului este invalid",
    });
  }

  let validatedData = new Date();
  if (data) {
    try {
      validatedData = new Date(data);
      if (isNaN(validatedData.getTime())) {
        throw new Error();
      }
    } catch {
      throw createError({
        statusCode: 400,
        message: "Data documentului este invalidă",
      });
    }
  }

  return {
    file: {
      data: fileData.data,
      filename: sanitizedFilename,
      type: fileData.type,
    },
    tip: sanitizeString(tip),
    titlu: sanitizeString(titlu),
    descriere: descriere ? sanitizeString(descriere) : "",
    data: validatedData,
  };
}
