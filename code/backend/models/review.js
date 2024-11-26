const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  movie_id: { type: String, required: true },
  username: { type: String, required: true }, // Use username instead of user_id
  review_text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 10, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
