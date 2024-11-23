const express = require("express");
const axios = require("axios");
const router = express.Router();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

router.get("/", (req, res) => {
    res.render("index"); // This loads the `index.ejs` file
  });

// Fetch popular movies
router.get("/popular", async (req, res) => {
    const TMDB_BASE_URL = "https://api.themoviedb.org/3";
    const { sort_by = "popularity.desc", genre, year } = req.query;
    try {
      // Fetch filtered and sorted movies
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          sort_by, // e.g., "vote_average.desc", "release_date.desc"
          with_genres: genre, // Genre ID
          primary_release_year: year, // Release year
        },
      });
  
      const movies = response.data.results;
      res.render("popular", { movies });
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).send("Failed to fetch movies.");
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

router.get("/movie/:id", async (req, res) => {
    const TMDB_BASE_URL = "https://api.themoviedb.org/3";
    try {
      // Fetch movie details from TMDb API
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
        },
      });
  
      const movie = response.data;
      res.render("movie", { movie });
    } catch (error) {
      console.error("Error fetching movie details:", error);
      res.status(500).send("Failed to fetch movie details.");
    }
  });

  const reviews = {}; // Temporary in-memory storage for reviews

  router.post("/movie/review", (req, res) => {
    const { movie_id, review } = req.body;
  
    if (!reviews[movie_id]) {
      reviews[movie_id] = [];
    }
    reviews[movie_id].push(review);
  
    res.redirect(`/movie/${movie_id}`);
  });
  
  router.get("/login", (req, res) => {
    res.send("Login page coming soon!");
  });
  
  router.get("/signup", (req, res) => {
    res.send("Sign-Up page coming soon!");
  });
  

module.exports = router;
