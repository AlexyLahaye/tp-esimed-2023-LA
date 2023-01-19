const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { Sequelize, Model, DataTypes } = require('sequelize');
const { body, validationResult } = require('express-validator');
const guard = require('express-jwt-permissions')({requestProperty: 'auth'});


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
router.get('/:firstName',guard.check('admin'), async(req, res) => {
    const foundUser = await userRepository.getUserByFirstName(req.params.firstName);

    if (!foundUser) {
        throw new Error('User not found');
    }

    res.send(foundUser);
});

router.post('/',body('firstName').not().isEmpty(),body('password').isAlphanumeric().isLength({min:5}), async (req, res) => {
    const existingUser = await userRepository.getUserByFirstName(req.body.firstName);

    if (existingUser) {
        res.status(500).end();
        return;
    }

    await userRepository.createUser(req.body);
    res.status(201).end();
});

router.put('/:id',guard.check('admin'), async (req, res) => {
    await userRepository.updateUser(req.params.id, req.body);
    res.status(204).end();
});

router.delete('/:id',guard.check('admin'), async (req, res) => {
    await userRepository.deleteUser(req.params.id);
    res.status(204).end();
});

exports.initializeRoutes = () => router;
