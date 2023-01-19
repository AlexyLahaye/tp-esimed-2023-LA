const { DataTypes } = require('sequelize');
const { sequelize } = require('./sqlite.db');

exports.User = sequelize.define('User', {
    id: { primaryKey: true, type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'user' });


