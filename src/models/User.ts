import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserProfileSchema = new Schema({
  supabaseId: { type: String, required: true, unique: true },
  role: { type: [String], enum: ['user', 'admin'], default: ['user'] },
  phone: String,
  displayName: String,
  defaultAddress: String
});

export default mongoose.model<IUser>('User', UserSchema);