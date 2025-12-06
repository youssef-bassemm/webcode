// server.js
require('dotenv').config();
const http = require('http');
const app = require('./index');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`SmartClinic backend listening on port ${PORT}`);
});
