import mongoose from "mongoose";

const intrareIesireSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nrInregistrare: {
    type: Number,
    required: true,
  },
  dataInregistrarii: {
    type: Date,
    required: true,
  },
  nrSiDataDocument: {
    numar: String,
    data: Date,
  },
  emitent: String,
  continutPeScurt: {
    type: String,
    required: true,
  },
  compartimentSiSemnatura: String,
  dataExpedierii: Date,
  destinatar: String,
  nrInregistrareLaCare: String,
  an: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

intrareIesireSchema.index({ userId: 1, an: 1 });

export const IntrareIesire =
  mongoose.models.IntrareIesire ||
  mongoose.model("IntrareIesire", intrareIesireSchema);
