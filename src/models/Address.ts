import { Schema, model } from 'mongoose';

const AddressSchema = new Schema({
  userId: { type: String, required: true },
  address: { type: String, required: true }
});

export default model('Address', AddressSchema);