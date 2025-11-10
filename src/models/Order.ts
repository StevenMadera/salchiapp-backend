import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: string;
  items: Array<{ menuItem: string; quantity: number }>;
  total: number;
}


const OrderSchema: Schema = new Schema({
  user: { type: String, required: true },
  items: [
    {
      menuItem: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending_payment', 'paid', 'cancelled'], default: 'pending_payment' },
  payment: {
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paypalOrderId: { type: String },
    details: { type: Object }
  },
  origin: {
    lat: { type: Number },
    lng: { type: Number }
  },
  destination: {
    lat: { type: Number },
    lng: { type: Number }
  }
});

export default mongoose.model<IOrder>('Order', OrderSchema);