const express = require('express');
const app = express();
const port = 3000;
const users = [];
let id_serialise = 0;

app.use(express.json());

app.use((req, res, next) => {
    console.log('%s', req);
    next();
});
app.get('/users', (req, res) => {
    res.send(users);
});
app.get('/users/:firstName', (req, res) => {
    const foundUser = users.find((user) => user.firstName === +req.params.firstName);
    res.send(foundUser);
});
app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.id = id_serialise;
    users.push(req.body);
    res.sendStatus(201);
    ++ id_serialise;
});
app.put('/users/:id', (req, res) => {
    const foundUser = users.find((user) => user.id === +req.params.id);
    foundUser.firstName = req.body.firstName;
    foundUser.lastName = req.body.lastName;
    res.sendStatus(204);
});
app.delete('/users/:id', (req, res) => {
    const foundIndex = users.findIndex((user) => user.id === +req.params.id);
    users.splice(foundIndex, 1);
    res.sendStatus(204);
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
