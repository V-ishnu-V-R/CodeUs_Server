import mongoose from "mongoose";
const MessageSchma = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const MessageModel = mongoose.model("Messages", MessageSchma);
export default MessageModel;
