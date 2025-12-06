// Load environment config
require("dotenv").config();

// Import express application
const application = require("./index");

// Read port from configuration
const serverPort = process.env.PORT || 3000;

// Start listening
application.listen(serverPort, () => {
  console.log(`SmartClinic service online at port ${serverPort}`);
  console.log("JWT_SECRET =", JSON.stringify(process.env.JWT_SECRET));
});

