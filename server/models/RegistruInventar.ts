import mongoose from "mongoose";

const registruInventarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nrCrt: {
    type: Number,
    required: true,
  },
  elementeInventariate: {
    type: String,
    required: true,
  },
  valoareContabila: {
    type: Number,
    required: true,
    default: 0,
  },
  valoareCirculatie: {
    type: Number,
    required: true,
    default: 0,
  },
  diferenteEvaluare: {
    valoare: {
      type: Number,
      default: 0,
    },
    cauze: {
      type: String,
      default: "",
    },
  },
  data: {
    type: Date,
    required: true,
  },
  an: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

registruInventarSchema.index({ userId: 1, an: 1 });
registruInventarSchema.index({ userId: 1, data: -1 });

export const RegistruInventar =
  mongoose.models.RegistruInventar ||
  mongoose.model("RegistruInventar", registruInventarSchema);
