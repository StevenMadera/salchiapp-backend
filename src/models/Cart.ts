import mongoose, { Schema, Document } from 'mongoose';

interface CartItem {
  item: mongoose.Types.ObjectId;
  qty: number;
  customIngredients: mongoose.Types.ObjectId[];
  subtotal: number;
}

export interface ICart extends Document {
  items: CartItem[];
  userId?: mongoose.Types.ObjectId;
}

const CartSchema: Schema = new Schema({
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
      qty: { type: Number, required: true },
      customIngredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
      subtotal: { type: Number, required: true },
    },
  ],
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<ICart>('Cart', CartSchema);
