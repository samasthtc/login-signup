import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      maxlength: 500,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

postSchema.index({ body: "text" });

export default mongoose.model("Post", postSchema);
