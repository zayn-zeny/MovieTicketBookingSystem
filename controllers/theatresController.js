const { connectDB } = require('../config/ConnectDB');

const getAllTheatres = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Theatres');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTheatreById = async (req, res) => {
  const theatreId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('theatre_id', theatreId)
      .query('SELECT * FROM Theatres WHERE theatre_id = @theatre_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTheatre = async (req, res) => {
  const { name, location, total_screens } = req.body;

  if (!name || !location || !total_screens) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    await pool.request().query(
      `INSERT INTO Theatres (name, location, total_screens) 
       VALUES ('${name}', '${location}', ${total_screens})`
    );
    res.status(201).json({ message: "Theatre added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTheatre = async (req, res) => {
  const theatreId = req.params.id;
  const fields = req.body;

  let updates = Object.entries(fields).map(([key, value]) =>
    typeof value === 'string' ? `${key} = '${value}'` : `${key} = ${value}`
  ).join(', ');

  try {
    const pool = await connectDB();
    const result = await pool.request().query(
      `UPDATE Theatres SET ${updates} WHERE theatre_id = ${theatreId}`
    );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    res.status(200).json({ message: "Theatre updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTheatre = async (req, res) => {
  const theatreId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request().query(
      `DELETE FROM Theatres WHERE theatre_id = ${theatreId}`
    );

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    res.status(200).json({ message: "Theatre deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getScreensByTheatre = async (req, res) => {
  const theatreId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('theatreId', theatreId)
      .query(`
        SELECT * FROM Screens WHERE theatre_id = @theatreId
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTheatres,
  getTheatreById,
  addTheatre,
  updateTheatre,
  deleteTheatre,
  getScreensByTheatre
};