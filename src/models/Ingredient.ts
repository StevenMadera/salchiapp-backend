import { Schema, model, Document } from 'mongoose';

export interface IIngredient extends Document {
  name: string;
  price: number;
  type: string;
  stock: number;
}

const IngredientSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['sauce', 'protein', 'cheese'], required: true },
  stock: { type: Number, default: 0 }
});

export default model<IIngredient>('Ingredient', IngredientSchema);