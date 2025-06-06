const { connectDB } = require('../config/ConnectDB');

const getAllBookings = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Bookings');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookingById = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('booking_id', sql.Int, bookingId)
      .query('SELECT * FROM Bookings WHERE booking_id = @booking_id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addBooking = async (req, res) => {
  const { user_id, show_id, num_tickets, total_amount, booking_time } = req.body;

  if (!user_id || !show_id || !num_tickets || !total_amount || !booking_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      INSERT INTO Bookings (user_id, show_id, num_tickets, total_amount, booking_time) 
      VALUES (${user_id}, ${show_id}, ${num_tickets}, ${total_amount}, '${booking_time}')
    `;
    await pool.request().query(query);
    res.status(201).json({ message: "Booking added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { num_tickets, total_amount, booking_time } = req.body;

  let updateQueryParts = [];

  if (num_tickets) updateQueryParts.push(`num_tickets = ${num_tickets}`);
  if (total_amount) updateQueryParts.push(`total_amount = ${total_amount}`);
  if (booking_time) updateQueryParts.push(`booking_time = '${booking_time}'`);

  if (updateQueryParts.length === 0) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  const updateQuery = `
    UPDATE Bookings 
    SET ${updateQueryParts.join(', ')}
    WHERE booking_id = ${bookingId}
  `;

  try {
    const pool = await connectDB();
    const result = await pool.request().query(updateQuery);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const pool = await connectDB();
    const query = `DELETE FROM Bookings WHERE booking_id = ${bookingId}`;
    const result = await pool.request().query(query);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  addBooking,
  updateBooking,
  deleteBooking
};