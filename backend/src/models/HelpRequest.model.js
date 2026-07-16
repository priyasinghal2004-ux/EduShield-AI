const mongoose = require("mongoose");

const HelpRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["mental", "financial", "general"],
      default: "general",
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HelpRequest", HelpRequestSchema);