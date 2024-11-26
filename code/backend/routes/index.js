const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/User");
const Review = require("../models/Review");

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

router.get("/", async (req, res) => {
    try {
      // Fetch latest movies for the carousel
      const latestMoviesResponse = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          page: 1,
        },
      });
      const latestMovies = latestMoviesResponse.data.results;
  
      let additionalLists = {}; // Placeholder for additional lists
  
      // Fetch additional lists if the user is logged in
      if (req.session?.username) {
        const topRatedActionResponse = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: "en-US",
            with_genres: 28, // Genre: Action
            sort_by: "vote_average.desc",
            vote_count_gte: 50, // To ensure valid ratings
          },
        });
  
        const topRatedComedyResponse = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: "en-US",
            with_genres: 35, // Genre: Comedy
            sort_by: "vote_average.desc",
            vote_count_gte: 50,
          },
        });
  
        additionalLists = {
          topRatedAction: topRatedActionResponse.data.results,
          topRatedComedy: topRatedComedyResponse.data.results,
        };
      }
  
      // Render homepage
      res.render("index", {
        latestMovies,
        additionalLists,
        username: req.session?.username || null,
        role: req.session?.role || null,
      });
    } catch (error) {
      console.error("Error fetching homepage data:", error.message);
      res.status(500).send("Failed to load homepage.");
    }
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
      res.render("popular", { 
        movies,
      username: req.session?.username || null, // Pass username to the template
      role: req.session?.role || null, // Pass role to the template
    });
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
    const { id } = req.params;
  
    try {
      // Fetch movie details
      const movieResponse = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
        },
      });
  
      const movie = movieResponse.data;
  
      // Fetch reviews for the movie
      const reviews = await Review.find({ movie_id: id });
  
      res.render("movie", { 
        movie,
        reviews,
        username: req.session?.username || null, // Pass username to the template
        role: req.session?.role || null, // Pass role to the template  
    });
    } catch (error) {
      console.error("Error fetching movie details or reviews:", error.message);
      res.status(500).send("Failed to fetch movie details or reviews.");
    }
  });
  
// Login Route
router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;
    try {
      const user = await User.findOne({ email, role });
      if (!user) return res.status(404).send("User not found with the specified role!");
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).send("Invalid credentials!");
  
      // Store the username in session or a placeholder (to simulate logged-in state)
      req.session.username = user.username; // Assign username to session
      req.session.role = user.role;
        console.log("Session after login:", req.session); // Debugging
        res.redirect("/");
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Error logging in.");
    }
  });  
  
// Sign-Up Route
router.post("/signup", async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      const user = new User({ username, email, password, role });
      await user.save();
      // Store the username in session or a placeholder (to simulate logged-in state)
      req.session.username = user.username; // Assign username to session
      console.log("Session after signup:", req.session); // Debugging
      res.redirect("/");
    } catch (error) {
      console.error("Sign-Up Error:", error);
      res.status(500).send("Error registering user.");
    }
  });  
  
// Submit Review Route
router.post("/movie/:id/review", async (req, res) => {
    const { id } = req.params; // Movie ID from the URL
    const { review_text, rating } = req.body; // Review details from the form
    const username = req.session?.username; // Username from session
  
    if (!username) {
      return res.redirect(`/login?action=login`); // Redirect to login if not authenticated
    }
  
    try {
      // Create a new review
      const review = new Review({
        movie_id: id, // Movie ID from the URL
        username, // Username from session
        review_text, // Review text from the form
        rating: parseInt(rating, 10), // Parse rating as a number
      });
  
      await review.save(); // Save the review to the database
  
      res.redirect(`/movie/${id}`); // Redirect back to the movie page
    } catch (error) {
      console.error("Error submitting review:", error);
      res.status(500).send("Error submitting review.");
    }
  });
  
  
  

// Render Login and Sign-Up page
router.get("/login", (req, res) => {
    res.render("login");
  });
  
router.get("/signup", (req, res) => {
    res.redirect("/login"); // Reuse the same page for Sign-Up section
  });

  router.get("/logout", (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Error logging out.");
      }
      res.redirect("/"); // Redirect to the home page after logout
    });
  });
  
  

module.exports = router;
