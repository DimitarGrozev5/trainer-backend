const { default: mongoose } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { validIds } = require("../utils/validate-program");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  activePrograms: [
    {
      id: { type: String, required: true, enum: validIds },
      state: { type: Object, required: true },
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
