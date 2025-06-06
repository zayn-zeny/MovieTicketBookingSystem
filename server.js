const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files (adjusted for correct path)
//app.use(express.static(path.join('D:', 'Zayn', 'Project DB Lab', 'Frontend')));

// ✅ Optional: serve index.html for the home route
//app.get('/', (req, res) => {
//  res.sendFile(path.join('D:', 'Zayn', 'Project DB Lab', 'Frontend', 'index.html'));
//});

// 🔗 API Routes
const movieRoutes = require('./routes/movies');
app.use('/api/movies', movieRoutes);

const theatreRoutes = require('./routes/theatres');
app.use('/api/theatres', theatreRoutes);

const screenRoutes = require('./routes/screens');
app.use('/api/screens', screenRoutes); 

const showRoutes = require('./routes/shows');
app.use('/api/shows', showRoutes);

const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

const seatRoutes = require('./routes/seats');
app.use('/api/seats', seatRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

const customerRoutes = require('./routes/customers');
app.use('/api/customers', customerRoutes);

const adminRoutes = require('./routes/admins');
app.use('/api/admins', adminRoutes);

const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);

// ✅ Start server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
