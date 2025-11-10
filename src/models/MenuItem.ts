import { Schema, model, Types } from 'mongoose';

export interface IMenuItem {
  name: string;
  description: string;
  basePrice: number;
  ingredients: Types.ObjectId[];
  imageUrl: string;
  isCustomizable: boolean;
}

const MenuItemSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  ingredients: [{ type: Types.ObjectId, ref: 'Ingredient' }],
  imageUrl: String,
  isCustomizable: { type: Boolean, default: false }
});

export default model('MenuItem', MenuItemSchema);