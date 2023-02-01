import { timeStamp } from "console";
import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "posts",
    },
    comment: String,
  },
  { timeStamps: true }
);
export const CommentModel = mongoose.model("comments", commentSchema);
export default CommentModel
