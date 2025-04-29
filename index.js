const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models/user');
const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/market');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
const tradeRoutes = require('./routes/trade');
app.use('/api/trade', tradeRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Stock Broker Backend API is running');
});

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
