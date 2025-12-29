import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tip: {
    type: String,
    enum: [
      "contract",
      "extras",
      "declaratie",
      "plati-impozite",
      "divers",
      "factura-emisa",
      "factura-primita",
    ],
    required: true,
  },
  titlu: {
    type: String,
    required: true,
  },
  descriere: String,
  data: {
    type: Date,
    default: Date.now,
  },
  fisier: {
    url: String,
    key: String,
    nume: String,
    marime: Number,
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

documentSchema.index({ userId: 1, tip: 1, data: -1 });

export const Document =
  mongoose.models.Document || mongoose.model("Document", documentSchema);
