const mongoose = require('mongoose');

// Import the LocalShow model
const LocalShow = require('./models/LocalShow'); // Adjust the path if needed

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost:27017/cinescope', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const localShows = [
  {
    title: "GREGORIAN PURE CHANTS",
    date: new Date("2024-11-26"),
    time: "7:30 PM",
    location: "Conexus Arts Centre, Capital Auto Theatre",
    city: "Regina",
    description: "Experience the mesmerizing sounds of Gregorian chants in a pure and authentic performance.",
    imageUrl: "https://conexusartscentre.ca/wp-content/uploads/2024/08/GregorianChants_REG_1080x1080.jpg",
    ticketUrl: "https://conexusartscentre.ca/event/gregorian-pure-chants/",
  },
  {
    title: "CIRQUE MUSICA HOLIDAY WONDERLAND",
    date: new Date("2024-11-27"),
    time: "7:30 PM",
    location: "Conexus Arts Centre, Capital Auto Theatre",
    city: "Regina",
    description: "A festive fusion of circus acts and holiday music, perfect for the entire family.",
    imageUrl: "https://conexusartscentre.ca/wp-content/uploads/2024/08/CMHW24_1080x1080.jpg",
    ticketUrl: "https://conexusartscentre.ca/event/cirque-musica-holiday-wonderland/",
  },
  {
    title: "BALLET JÖRGEN – THE NUTCRACKER: A CANADIAN TRADITION",
    date: new Date("2024-11-28"),
    time: "7:30 PM",
    location: "Conexus Arts Centre, Capital Auto Theatre",
    city: "Regina",
    description: "A uniquely Canadian rendition of the classic ballet, showcasing local heritage and talent.",
    imageUrl: "https://conexusartscentre.ca/wp-content/uploads/2024/08/2.jpg",
    ticketUrl: "https://conexusartscentre.ca/event/ballet-jorgen-the-nutcracker-a-canadian-tradition/",
  },
  {
    title: "SMALL BUSINESS CHRISTMAS PARTY – SOLD OUT",
    date: new Date("2024-11-29"),
    time: "6:00 PM",
    location: "Conexus Arts Centre",
    city: "Regina",
    description:
      "An exclusive event celebrating small businesses with dinner and live entertainment.",
    imageUrl: "https://conexusartscentre.ca/wp-content/uploads/2024/09/Small-Xmas-Party.indd-21.jpg",
    ticketUrl: "https://conexusartscentre.ca/event/small-business-christmas-party/",
  },
  {
    title: "THE BOOK OF MORMON",
    date: new Date("2024-12-03"),
    time: "7:30 PM",
    location: "Conexus Arts Centre",
    city: "Regina",
    description: "The acclaimed Broadway musical known for its sharp wit and humor.",
    imageUrl: "https://conexusartscentre.ca/wp-content/uploads/2024/08/BAC_2024_BOM_Venue_Regina_1080x1080_EN.jpg",
    ticketUrl: "https://conexusartscentre.ca/event/book-of-mormon/",
  },
  // Add the remaining events here
];

// Insert the localShows data into the database
LocalShow.insertMany(localShows)
  .then(() => {
    console.log("Local shows added successfully.");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error adding local shows:", error);
    mongoose.connection.close();
  });
