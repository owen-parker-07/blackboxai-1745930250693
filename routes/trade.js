const express = require('express');
const { User } = require('../models/user');
const { Portfolio } = require('../models/portfolio');
const { Stock, MutualFund, Future, Option } = require('../models/market');

const router = express.Router();

// Helper to get model by instrument type
function getModelByType(type) {
  switch(type) {
    case 'stock': return Stock;
    case 'mutualfund': return MutualFund;
    case 'future': return Future;
    case 'option': return Option;
    default: return null;
  }
}

// Buy instrument
router.post('/buy', async (req, res) => {
  const { userId, instrumentType, symbol, quantity } = req.body;
  if (!userId || !instrumentType || !symbol || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const Model = getModelByType(instrumentType);
    if (!Model) return res.status(400).json({ message: 'Invalid instrument type' });

    const instrument = await Model.findOne({ where: { symbol } });
    if (!instrument) return res.status(404).json({ message: 'Instrument not found' });

    const price = instrument.price || instrument.nav || 0;
    const totalCost = price * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct balance
    user.balance -= totalCost;
    await user.save();

    // Update portfolio
    let portfolio = await Portfolio.findOne({ where: { userId, instrumentType, symbol } });
    if (portfolio) {
      // Update average price and quantity
      const newQuantity = portfolio.quantity + quantity;
      const newAvgPrice = ((portfolio.averagePrice * portfolio.quantity) + totalCost) / newQuantity;
      portfolio.quantity = newQuantity;
      portfolio.averagePrice = newAvgPrice;
      await portfolio.save();
    } else {
      portfolio = await Portfolio.create({
        userId,
        instrumentType,
        symbol,
        quantity,
        averagePrice: price
      });
    }

    res.json({ message: 'Purchase successful', portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sell instrument
router.post('/sell', async (req, res) => {
  const { userId, instrumentType, symbol, quantity } = req.body;
  if (!userId || !instrumentType || !symbol || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }
  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const portfolio = await Portfolio.findOne({ where: { userId, instrumentType, symbol } });
    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient holdings' });
    }

    const Model = getModelByType(instrumentType);
    if (!Model) return res.status(400).json({ message: 'Invalid instrument type' });

    const instrument = await Model.findOne({ where: { symbol } });
    if (!instrument) return res.status(404).json({ message: 'Instrument not found' });

    const price = instrument.price || instrument.nav || 0;
    const totalProceeds = price * quantity;

    // Add balance
    user.balance += totalProceeds;
    await user.save();

    // Update portfolio
    portfolio.quantity -= quantity;
    if (portfolio.quantity === 0) {
      await portfolio.destroy();
    } else {
      await portfolio.save();
    }

    res.json({ message: 'Sale successful', portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user portfolio
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const portfolio = await Portfolio.findAll({ where: { userId } });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
