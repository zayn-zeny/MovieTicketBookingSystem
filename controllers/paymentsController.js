const { connectDB } = require('../config/ConnectDB');

const getAllPayments = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Payments');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPaymentById = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Payments WHERE payment_id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addPayment = async (req, res) => {
  const { booking_id, payment_method, payment_date, amount } = req.body;

  if (!booking_id || !payment_method || !payment_date || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      INSERT INTO Payments (booking_id, payment_method, payment_date, amount)
      VALUES (@booking_id, @payment_method, @payment_date, @amount)
    `;

    await pool.request()
      .input('booking_id', booking_id)
      .input('payment_method', payment_method)
      .input('payment_date', payment_date)
      .input('amount', amount)
      .query(query);

    res.status(201).json({ message: 'Payment added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePayment = async (req, res) => {
  const id = req.params.id;
  const { booking_id, payment_method, payment_date, amount } = req.body;

  try {
    const pool = await connectDB();
    const fields = [];

    if (booking_id) fields.push(`booking_id='${booking_id}'`);
    if (payment_method) fields.push(`payment_method='${payment_method}'`);
    if (payment_date) fields.push(`payment_date='${payment_date}'`);
    if (amount) fields.push(`amount=${amount}`);

    const updateQuery = `
      UPDATE Payments SET ${fields.join(', ')} WHERE payment_id = ${id}
    `;

    const result = await pool.request().query(updateQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePayment = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .query(`DELETE FROM Payments WHERE payment_id = ${id}`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  addPayment,
  updatePayment,
  deletePayment
};