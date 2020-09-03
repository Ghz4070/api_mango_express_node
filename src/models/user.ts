import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  birthday: { type: Date, required: true },
  civility: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, default: null },
  grade: { type: Number, required: true, default: 5 },
  createdAt: { type: Date, default: Date.now },
  lastConnection: { type: Date, required: true },
  activation: { type: Boolean, default: false },
  blacklisted: { type: Boolean, default: false },
});

const User = mongoose.model('users', userSchema);

export default User;
