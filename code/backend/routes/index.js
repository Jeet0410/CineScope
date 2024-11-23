const express = require("express");
const axios = require("axios");
const router = express.Router();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

router.get("/", (req, res) => {
    res.render("index"); // This loads the `index.ejs` file
  });

// Fetch popular movies
router.get("/popular", async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        language: "en-US",
        page: 1,
      },
    });

    const movies = response.data.results;
    res.render("popular", { movies });
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).send("Failed to fetch popular movies.");
  }
});

// Search movies
router.get("/search", async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query: query,
        language: "en-US",
      },
    });

    const results = response.data.results;
    res.render("popular", { movies: results });
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).send("Search failed.");
  }
});

module.exports = router;
