const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { Sequelize, Model, DataTypes } = require('sequelize');

router.get('/', (req, res) => {
    res.send(userRepository.getUsers());
});

router.get('/test-sqlite',async(req,res) => {
    const sequelize = new Sequelize('sqlite::memory:');
    const User = sequelize.define('User', {
        username: DataTypes.STRING,
        birthday: DataTypes.DATE,
    });

    await User.sync();

    const jane = await User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20),
    });
    const users = await User.findAll();
    res.send(users);
});
router.get('/:firstName', (req, res) => {
    const foundUser = userRepository.getUserByFirstName(req.params.firstName);

    if (!foundUser) {
        throw new Error('User not found');
    }

    res.send(foundUser);
});

router.post('/', (req, res) => {
    const existingUser = userRepository.getUserByFirstName(req.body.firstName);

    if (existingUser) {
        throw new Error('Unable to create the user');
    }

    userRepository.createUser(req.body);
    res.status(201).end();
});

router.put('/:id', (req, res) => {
    userRepository.updateUser(req.params.id, req.body);
    res.status(204).end();
});

router.delete('/:id', (req, res) => {
    userRepository.deleteUser(req.params.id);
    res.status(204).end();
});

exports.initializeRoutes = () => router;
