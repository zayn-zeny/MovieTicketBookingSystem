const { connectDB } = require('../config/ConnectDB');

const getAllCustomers = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Customers');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCustomerById = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Customers WHERE customer_id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addCustomer = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      INSERT INTO Customers (name, email, phone)
      VALUES (@name, @email, @phone)
    `;

    await pool.request()
      .input('name', name)
      .input('email', email)
      .input('phone', phone)
      .query(query);

    res.status(201).json({ message: 'Customer added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCustomer = async (req, res) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;

  try {
    const pool = await connectDB();

    const fields = [];
    if (name) fields.push(`name='${name}'`);
    if (email) fields.push(`email='${email}'`);
    if (phone) fields.push(`phone='${phone}'`);

    const updateQuery = `
      UPDATE Customers SET ${fields.join(', ')} WHERE customer_id = ${id}
    `;

    const result = await pool.request().query(updateQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getCustomerBookings = async (req, res) => {
  const customerId = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('customerId', customerId)
      .query(`
        SELECT B.*, M.title AS movie_title
        FROM Bookings B
        JOIN Shows S ON B.show_id = S.show_id
        JOIN Movies M ON S.movie_id = M.movie_id
        WHERE B.customer_id = @customerId
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  getCustomerBookings
};