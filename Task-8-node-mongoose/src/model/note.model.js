import mongoose from "mongoose";
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: (val) => val.toUpperCase() !== val,
        message: "The name must not be entirely uppercase.",
      },
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Note", noteSchema);
