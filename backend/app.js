// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandler");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use(router);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} in your browser`);
});
