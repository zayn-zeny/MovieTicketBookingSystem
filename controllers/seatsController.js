const { connectDB } = require('../config/ConnectDB');

const getAllSeats = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Seats');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSeatById = async (req, res) => {
  const seatId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('seat_id', sql.Int, seatId)
      .query('SELECT * FROM Seats WHERE seat_id = @seat_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addSeat = async (req, res) => {
  const { show_id, seat_number, seat_type, is_available } = req.body;

  if (!show_id || !seat_number || !seat_type || is_available === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      INSERT INTO Seats (show_id, seat_number, seat_type, is_available) 
      VALUES (${show_id}, '${seat_number}', '${seat_type}', ${is_available})
    `;
    await pool.request().query(query);
    res.status(201).json({ message: "Seat added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSeat = async (req, res) => {
  const seatId = req.params.id;
  const { seat_number, seat_type, is_available } = req.body;

  let updateQueryParts = [];

  if (seat_number) updateQueryParts.push(`seat_number = '${seat_number}'`);
  if (seat_type) updateQueryParts.push(`seat_type = '${seat_type}'`);
  if (is_available !== undefined) updateQueryParts.push(`is_available = ${is_available}`);

  if (updateQueryParts.length === 0) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  const updateQuery = `
    UPDATE Seats 
    SET ${updateQueryParts.join(', ')}
    WHERE seat_id = ${seatId}
  `;

  try {
    const pool = await connectDB();
    const result = await pool.request().query(updateQuery);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.status(200).json({ message: "Seat updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSeat = async (req, res) => {
  const seatId = req.params.id;

  try {
    const pool = await connectDB();
    const query = `DELETE FROM Seats WHERE seat_id = ${seatId}`;
    const result = await pool.request().query(query);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.status(200).json({ message: "Seat deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllSeats,
  getSeatById,
  addSeat,
  updateSeat,
  deleteSeat
};
