const express = require('express');
const cors = require('cors');
const { DateTime } = require('luxon');

const initJsonHandlerMiddlware = (app) => app.use(express.json());

const publicrepertory = (app) => app.use(express.static('public'));
const initcors = (app) => app.use(cors());
const initLoggerMiddlware = (app) => {
    app.use((req, res, next) => {
        const begin = new DateTime(new Date());

        res.on('finish', () => {
            const requestDate = begin.toString();
            const remoteIP = `IP: ${req.connection.remoteAddress}`;
            const httpInfo = `${req.method} ${req.baseUrl || req.path}`;

            const end = new DateTime(new Date());
            const requestDurationMs = end.diff(begin).toMillis();
            const requestDuration = `Duration: ${requestDurationMs}ms`;

            console.log(`[${requestDate}] - [${remoteIP}] - [${httpInfo}] - [${requestDuration}]`);
        })
        next();
    });
};

exports.initializeConfigMiddlewares = (app) => {
    publicrepertory(app);
    initcors(app);
    initJsonHandlerMiddlware(app);
    initLoggerMiddlware(app);
}

exports.initializeErrorMiddlwares = (app) => {
    app.use((err, req, res, next) => {
        res.status(500).send(err.message);
    });
}
