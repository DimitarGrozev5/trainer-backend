import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const blacklistedSchema = new Schema({
  token: { type: String, required: true, unique: true },
  expiresBy: { type: Number, required: true },
});

blacklistedSchema.plugin(uniqueValidator);

export default mongoose.model("BlacklistedJWT", blacklistedSchema);
