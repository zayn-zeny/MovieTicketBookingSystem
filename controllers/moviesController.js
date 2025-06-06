const { connectDB, sql } = require('../config/ConnectDB');

const getAllMovies = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Movies');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchMoviesByName = async (req, res) => {
  const keyword = req.query.name;

  if (!keyword) {
    return res.status(400).json({ error: "Missing 'name' query parameter" });
  }

  try {
    const pool = await connectDB();
    const query = `
      SELECT * FROM Movies
      WHERE title LIKE '%' + @keyword + '%'
    `;
    const result = await pool.request()
      .input('keyword', sql.VarChar, keyword)
      .query(query);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMoviesByGenre = async (req, res) => {
  const genre = req.params.genre;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('genre', genre)
      .query('SELECT * FROM Movies WHERE genre = @genre');

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const getMovieById = async (req, res) => {
  const movieId = req.params.id;
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('movie_id', sql.Int, movieId)
      .query('SELECT * FROM Movies WHERE movie_id = @movie_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMovie = async (req, res) => {
  const { title, genre, duration, language, release_date, rating, description } = req.body;
  if (!title || !genre || !duration || !language || !release_date || !rating || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      INSERT INTO Movies (title, genre, duration, language, release_date, rating, description)
      VALUES (@title, @genre, @duration, @language, @release_date, @rating, @description)
    `;
    await pool.request()
      .input('title', sql.VarChar(255), title)
      .input('genre', sql.VarChar(100), genre)
      .input('duration', sql.Int, duration)
      .input('language', sql.VarChar(50), language)
      .input('release_date', sql.Date, release_date)
      .input('rating', sql.Float, rating)
      .input('description', sql.Text, description)
      .query(query);

    res.status(201).json({ message: "Movie added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMovie = async (req, res) => {
  const movieId = req.params.id;
  const { title, genre, duration, language, release_date, rating, description } = req.body;

  try {
    const pool = await connectDB();

    let updates = [];
    if (title) updates.push(`title = '${title}'`);
    if (genre) updates.push(`genre = '${genre}'`);
    if (duration) updates.push(`duration = ${duration}`);
    if (language) updates.push(`language = '${language}'`);
    if (release_date) updates.push(`release_date = '${release_date}'`);
    if (rating) updates.push(`rating = ${rating}`);
    if (description) updates.push(`description = '${description}'`);

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const query = `
      UPDATE Movies 
      SET ${updates.join(', ')}
      WHERE movie_id = ${movieId}
    `;

    const result = await pool.request().query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie updated successfully" });
  } catch (err) {
    console.error("❌ Error updating movie:", err);
    res.status(500).json({ error: err.message });
  }
};


const deleteMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const pool = await connectDB();
    const query = `DELETE FROM Movies WHERE movie_id = @movie_id`;
    const result = await pool.request()
      .input('movie_id', sql.Int, movieId)
      .query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReviewsByMovie = async (req, res) => {
  const movieId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('movieId', movieId)
      .query(`
        SELECT r.review_id, r.rating, r.review_text, r.review_date, c.name AS customer_name
        FROM Reviews r
        JOIN Customers c ON r.customer_id = c.customer_id
        WHERE r.movie_id = @movieId
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMoviesByRating = async (req, res) => {
  try {
    const pool = await connectDB();
    const query = `
      SELECT * FROM Movies
      ORDER BY rating DESC
    `;
    const result = await pool.request().query(query);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getMovieAnalyticsSummary = async (req, res) => {
  try {
    const pool = await connectDB();

    const query = `
            -- 1. Most Booked Movies (with Avg Rating)
      SELECT 
          m.movie_id,
          m.title,
          COUNT(b.booking_id) AS total_bookings,
          AVG(r.rating) AS average_rating,
          m.genre
      FROM Movies m
      JOIN Shows s ON m.movie_id = s.movie_id
      JOIN Bookings b ON s.show_id = b.show_id
      LEFT JOIN Reviews r ON m.movie_id = r.movie_id
      GROUP BY m.movie_id, m.title, m.genre
      HAVING COUNT(b.booking_id) >= 5

      UNION

      -- 2. Genre-wise Summary (Average Rating)
      SELECT 
          NULL AS movie_id,
          'GENRE SUMMARY: ' + m.genre AS title,
          NULL AS total_bookings,
          AVG(r.rating) AS average_rating,
          m.genre
      FROM Movies m
      JOIN Reviews r ON m.movie_id = r.movie_id
      GROUP BY m.genre
      HAVING AVG(r.rating) > 3

      INTERSECT

      -- 3. Movies that are both highly booked and highly rated
      SELECT 
          m.movie_id,
          m.title,
          COUNT(b.booking_id),
          AVG(r.rating),
          m.genre
      FROM Movies m
      JOIN Shows s ON m.movie_id = s.movie_id
      JOIN Bookings b ON s.show_id = b.show_id
      LEFT JOIN Reviews r ON m.movie_id = r.movie_id
      GROUP BY m.movie_id, m.title, m.genre
      HAVING AVG(r.rating) > 4

      EXCEPT

      -- 4. Movies that were never booked
      SELECT 
          m.movie_id,
          m.title,
          NULL,
          NULL,
          m.genre
      FROM Movies m
      WHERE m.movie_id NOT IN (
          SELECT DISTINCT s.movie_id
          FROM Bookings b
          JOIN Shows s ON b.show_id = s.show_id
      )

    `;

    const result = await pool.request().query(query);
    res.status(200).json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getAllMovies,
  searchMoviesByName,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  getReviewsByMovie,
  getMoviesByRating,
  getMovieAnalyticsSummary
};
