import mongoose from "mongoose";

const incasarePlataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nrCrt: {
    type: Number,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  document: {
    tip: String,
    numar: String,
  },
  felulOperatiunii: {
    type: String,
    required: true,
  },
  tip: {
    type: String,
    enum: ["incasare", "plata"],
    required: true,
  },
  suma: {
    type: Number,
    required: true,
  },
  banca: String,
  an: {
    type: Number,
    required: true,
  },
  luna: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

incasarePlataSchema.index({ userId: 1, an: 1, luna: 1 });
incasarePlataSchema.index({ userId: 1, data: -1 });

export const IncasarePlata =
  mongoose.models.IncasarePlata ||
  mongoose.model("IncasarePlata", incasarePlataSchema);
