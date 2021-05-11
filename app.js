const express = require('express');
const app = express();
const explorerRouter = require('./api/router/explorer');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/explorer', explorerRouter);

app.use((req, res, next) => {
    res.status(404).json({
        message : 'URL not found...'
    })
})

module.exports = app;