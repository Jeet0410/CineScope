const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
const indexRouter = require("./routes/index");

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cinescope";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

// Middleware for static files
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.use(
    session({
      secret: "your_secret_key", // Replace with a strong secret key
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to `true` if using HTTPS
    })
  );  

// Middleware to inject session data into views
app.use((req, res, next) => {
    res.locals.username = req.session ? req.session.username : null; // Set username if logged in
    next();
  });   

// Routes
app.use("/", indexRouter);

// Error Handling
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
