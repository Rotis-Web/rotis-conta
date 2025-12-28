import mongoose from "mongoose";

const facturaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tip: {
    type: String,
    enum: ["emisa", "primita"],
    required: true,
  },
  numarFactura: {
    type: String,
    required: true,
  },
  serie: String,
  data: {
    type: Date,
    required: true,
  },
  client: {
    nume: String,
    cui: String,
    adresa: String,
  },
  servicii: [
    {
      denumire: String,
      cantitate: Number,
      pretUnitar: Number,
      valoare: Number,
    },
  ],
  subtotal: Number,
  tva: Number,
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["platita", "neplatita", "partial"],
    default: "neplatita",
  },
  fisier: {
    url: String,
    key: String,
    nume: String,
  },
  an: Number,
  luna: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

facturaSchema.index({ userId: 1, tip: 1, data: -1 });

export const Factura =
  mongoose.models.Factura || mongoose.model("Factura", facturaSchema);
