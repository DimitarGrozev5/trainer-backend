const { default: mongoose } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  activePrograms: [
    {
      // TODO: add only allowed IDs
      id: { type: String, required: true },
      state: { type: Object, required: true },
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
