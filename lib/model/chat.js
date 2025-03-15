import { Schema, models, model } from "mongoose";

const messageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  msg: [messageSchema], 
  mailId: {
    type: String,
    required: true,
  },
});

const Chat = models.Chat || model("Chat", chatSchema);
export default Chat;
