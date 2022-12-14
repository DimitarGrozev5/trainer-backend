import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { validIds } from '../programs/index.js';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  activePrograms: [
    {
      id: { type: String, required: true, enum: validIds },
      state: { type: Object, required: true },
      salt: { type: String, required: true },
    },
  ],
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
