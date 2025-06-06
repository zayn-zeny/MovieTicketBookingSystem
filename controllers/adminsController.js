const { connectDB } = require('../config/ConnectDB');

const getAllAdmins = async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM Admins');
    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAdminById = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('id', id)
      .query('SELECT * FROM Admins WHERE admin_id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addAdmin = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const pool = await connectDB();
    const query = `
      INSERT INTO Admins (name, email)
      VALUES (@name, @email)
    `;

    await pool.request()
      .input('name', name)
      .input('email', email)
      .query(query);

    res.status(201).json({ message: 'Admin added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateAdmin = async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;

  try {
    const pool = await connectDB();

    const fields = [];
    if (name) fields.push(`name='${name}'`);
    if (email) fields.push(`email='${email}'`);

    const updateQuery = `
      UPDATE Admins SET ${fields.join(', ')} WHERE admin_id = ${id}
    `;

    const result = await pool.request().query(updateQuery);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAdmin = async (req, res) => {
  const id = req.params.id;

  try {
    const pool = await connectDB();
    const result = await pool.request()
      .query(`DELETE FROM Admins WHERE admin_id = ${id}`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  addAdmin,
  updateAdmin,
  deleteAdmin
};