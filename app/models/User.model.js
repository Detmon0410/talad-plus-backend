const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,

  username: {
    type: String,
    unique: true,
  },
  password: String,
  role: String,
  email: String,
  province: String,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
