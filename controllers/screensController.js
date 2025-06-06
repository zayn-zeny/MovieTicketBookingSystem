const { connectDB } = require('../config/ConnectDB');
const sql = require('mssql');

const getAllScreens = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Screens');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getScreenById = async (req, res) => {
  const screenId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('screen_id', sql.Int, screenId)
      .query('SELECT * FROM Screens WHERE screen_id = @screen_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addScreen = async (req, res) => {
  const { theatre_id, screen_number, capacity } = req.body;

  if (!theatre_id || !screen_number || !capacity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    await pool.request()
      .query(`INSERT INTO Screens (theatre_id, screen_number, capacity) 
              VALUES (${theatre_id}, ${screen_number}, ${capacity})`);

    res.status(201).json({ message: 'Screen added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateScreen = async (req, res) => {
    const screenId = req.params.id;
    const { theatre_id, screen_number, capacity } = req.body;
  
    // Build an array of update parts dynamically based on what the user provides
    let updateQueryParts = [];
  
    if (theatre_id) updateQueryParts.push(`theatre_id = ${theatre_id}`);
    if (screen_number) updateQueryParts.push(`screen_number = ${screen_number}`);
    if (capacity) updateQueryParts.push(`capacity = ${capacity}`);
  
    if (updateQueryParts.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }
  
    const updateQuery = `
      UPDATE Screens 
      SET ${updateQueryParts.join(', ')}
      WHERE screen_id = ${screenId}
    `;
  
    try {
      const pool = await connectDB();
      const result = await pool.request().query(updateQuery);
  
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'Screen not found' });
      }
  
      res.status(200).json({ message: 'Screen updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

const deleteScreen = async (req, res) => {
  const screenId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .query(`DELETE FROM Screens WHERE screen_id = ${screenId}`);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    res.status(200).json({ message: 'Screen deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllScreens,
  getScreenById,
  addScreen,
  updateScreen,
  deleteScreen
};
