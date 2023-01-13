const {DataTypes} = require("sequelize");
const {sequelize} = require( "./sqlite.db");

const User = sequelize.define('User', {
    id: {
        type : DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false
    } ,
    lastName:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.DATE,
        allowNull: false
    }
});