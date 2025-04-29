const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Stock model
const Stock = sequelize.define('Stock', {
  symbol: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Mutual Fund model
const MutualFund = sequelize.define('MutualFund', {
  symbol: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nav: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Futures model
const Future = sequelize.define('Future', {
  symbol: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

// Options model
const Option = sequelize.define('Option', {
  symbol: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  strikePrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('call', 'put'),
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = { Stock, MutualFund, Future, Option, sequelize };
