import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const activationSchema = new Schema({
  userId: { type: String, required: true },
  key: {
    type: String,
    required: true,
  },
  status: { type: Boolean, required: true, default: false },
});

const Activation = mongoose.model('activations', activationSchema);

export default Activation;
