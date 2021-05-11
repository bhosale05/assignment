const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const config = require('./config.json');
server.listen(config.expressserverport, console.log('App is Running...'));