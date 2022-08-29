const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const blacklistedSchema = new Schema({
  token: { type: String, required: true, unique: true },
  expiresBy: { type: Number, required: true },
});

blacklistedSchema.plugin(uniqueValidator);

module.exports = mongoose.model("BlacklistedJWT", blacklistedSchema);
