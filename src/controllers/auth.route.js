const express = require('express');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { Sequelize, Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {initializeRoutes} = require("./user.routes");
const {body} = require("express-validator");
const guard = require('express-jwt-permissions');

router.post('/login',body('firstName').not().isEmpty(),body('password').not().isEmpty(), async (req, res) => {
    if (!req.body.firstName || !req.body.password) {
        res.status(400).send("Paramètres manquants")
    } else {
        const userFound = await userRepository.getUserByFirstName(req.body.firstName)
        if (userFound) {
            if (bcrypt.compareSync(req.body.password, userFound.password)) {
                const payload = {
                    userId: userFound.id,
                    firstName: req.body.firstName,
                    permissions: userFound.isAdmin ? ['admin'] : []
                }

                res.status(200).send(jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }))
            } else {
                res.status(401).send("Mot de passe ou utilisateur incorrect")
            }
        } else {
            res.status(400).send("Mot de passe ou utilisateur incorrect")
        }
    }
});

exports.initializeRoutes = () => router;