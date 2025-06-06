const { connectDB } = require('../config/ConnectDB');

const getAllShows = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Shows');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getShowsByMovie = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('movieId', movieId)
      .query(`
        SELECT * FROM Shows WHERE movie_id = @movieId
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getShowById = async (req, res) => {
  const showId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('show_id', sql.Int, showId)
      .query('SELECT * FROM Shows WHERE show_id = @show_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addShow = async (req, res) => {
  const { movie_id, theatre_id, screen_id, show_time, ticket_price } = req.body;

  if (!movie_id || !theatre_id || !screen_id || !show_time || !ticket_price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      INSERT INTO Shows (movie_id, theatre_id, screen_id, show_time, ticket_price) 
      VALUES (${movie_id}, ${theatre_id}, ${screen_id}, '${show_time}', ${ticket_price})
    `;
    await pool.request().query(query);
    res.status(201).json({ message: "Show added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateShow = async (req, res) => {
  const showId = req.params.id;
  const { movie_id, theatre_id, screen_id, show_time, ticket_price } = req.body;

  let updateQueryParts = [];

  if (movie_id) updateQueryParts.push(`movie_id = ${movie_id}`);
  if (theatre_id) updateQueryParts.push(`theatre_id = ${theatre_id}`);
  if (screen_id) updateQueryParts.push(`screen_id = ${screen_id}`);
  if (show_time) updateQueryParts.push(`show_time = '${show_time}'`);
  if (ticket_price) updateQueryParts.push(`ticket_price = ${ticket_price}`);

  if (updateQueryParts.length === 0) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  const updateQuery = `
    UPDATE Shows 
    SET ${updateQueryParts.join(', ')}
    WHERE show_id = ${showId}
  `;

  try {
    const pool = await connectDB();
    const result = await pool.request().query(updateQuery);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json({ message: "Show updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteShow = async (req, res) => {
  const showId = req.params.id;

  try {
    const pool = await connectDB();
    const query = `DELETE FROM Shows WHERE show_id = ${showId}`;
    const result = await pool.request().query(query);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.status(200).json({ message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  getAllShows,
  getShowById,
  addShow,
  updateShow,
  deleteShow,
  getShowsByMovie
};