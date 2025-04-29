const express = require('express');
const { Stock, MutualFund, Future, Option } = require('../models/market');

const router = express.Router();

// Get all stocks (simulated live data)
router.get('/stocks', async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stocks' });
  }
});

// Get all mutual funds
router.get('/mutualfunds', async (req, res) => {
  try {
    const funds = await MutualFund.findAll();
    res.json(funds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mutual funds' });
  }
});

// Get all futures
router.get('/futures', async (req, res) => {
  try {
    const futures = await Future.findAll();
    res.json(futures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching futures' });
  }
});

// Get all options
router.get('/options', async (req, res) => {
  try {
    const options = await Option.findAll();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching options' });
  }
});

module.exports = router;
