const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  password: {
    type: String,
    required: true,  // will store hashed password
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],

}, { timestamps: true });


// Relationship: Room → Many Hisaab
roomSchema.virtual("hisaab", {
  ref: "Hisaab",           // Your expense model
  localField: "_id",
  foreignField: "roomId",
});

module.exports = mongoose.model("Room", roomSchema);
