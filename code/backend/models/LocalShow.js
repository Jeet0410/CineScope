// models/LocalShow.js
const mongoose = require('mongoose');

const localShowSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Event title
  date: { type: Date, required: true }, // Date of the event
  time: { type: String, required: true }, // Time of the event
  location: { type: String, required: true }, // Venue name or address
  city: { type: String, required: true }, // City where the event is held
  description: { type: String }, // Optional event description
  imageUrl: { type: String }, // Optional URL for the event image
  ticketUrl: { type: String }, // Optional URL for ticket booking
  creator: { type: String, required: true }
});

module.exports = mongoose.model('LocalShow', localShowSchema);
