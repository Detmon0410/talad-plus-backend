const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  topic: [{
    type: String,
  }],
  description: String,
});

const UserModel = mongoose.model("Report", userSchema);

module.exports = UserModel;