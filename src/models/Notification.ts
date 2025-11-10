import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default model('Notification', NotificationSchema);