const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Portfolio = sequelize.define('Portfolio', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  instrumentType: {
    type: DataTypes.ENUM('stock', 'mutualfund', 'future', 'option'),
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  averagePrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = { Portfolio, sequelize };
