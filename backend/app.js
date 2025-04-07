// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const { initializeBlockchain } = require("./services/blockchain.service");
const p2pService = require("./services/p2p.service");

// Initialize app
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Inisialisasi blockchain
initializeBlockchain();

// Inisialisasi P2P service
p2pService.init(server);

// Menyimpan p2pService di app untuk digunakan di routes
app.set("p2pService", p2pService);

// API Routes
app.use(router);

app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`BlockVote backend running on port ${PORT}`);
  console.log(`Node ID: ${p2pService.getNodeId()}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});
