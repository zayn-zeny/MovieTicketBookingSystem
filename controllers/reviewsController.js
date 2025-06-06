const { connectDB } = require('../config/ConnectDB');

const getAllReviews = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Reviews');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('review_id', sql.Int, reviewId)
      .query('SELECT * FROM Reviews WHERE review_id = @review_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addReview = async (req, res) => {
  const { movie_id, customer_id, rating, review_text, review_date } = req.body;

  if (!movie_id || !customer_id || !rating || !review_text || !review_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      INSERT INTO Reviews (movie_id, customer_id, rating, review_text, review_date) 
      VALUES (${movie_id}, ${customer_id}, ${rating}, '${review_text}', '${review_date}')
    `;
    await pool.request().query(query);
    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, review_text, review_date } = req.body;

  if (!rating || !review_text || !review_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      UPDATE Reviews 
      SET rating = ${rating}, review_text = '${review_text}', review_date = '${review_date}' 
      WHERE review_id = ${reviewId}
    `;
    const result = await pool.request().query(query);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const pool = await connectDB();
    const query = `
      DELETE FROM Reviews 
      WHERE review_id = ${reviewId}
    `;
    const result = await pool.request().query(query);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  addReview,
  updateReview,
  deleteReview
};