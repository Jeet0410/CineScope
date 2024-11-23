const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
const indexRouter = require("./routes/index");

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../frontend/views"));

// Middleware for static files
app.use(express.static(path.join(__dirname, "../frontend/public")));

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
