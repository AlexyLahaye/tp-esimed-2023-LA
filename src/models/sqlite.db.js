const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/models/database.sqlite'
});