const express = require("express");
const http = require("http");
const BlockchainService = require("./services/blockchain.service");
const P2PService = require("./services/p2pService");
// Import service dan route lainnya

const app = express();
const server = http.createServer(app);

// Inisialisasi service
const blockchainService = new BlockchainService();
const p2pService = new P2PService(server, blockchainService);

// Inject p2pService ke voting service
const votingService = new VotingService(blockchainService, p2pService);

// Tambahkan route untuk mengelola peer
app.get("/peers", (req, res) => {
  res.json({
    nodeId: p2pService.getNodeId(),
    peers: p2pService.getConnectedPeers(),
  });
});

app.post("/peers", (req, res) => {
  const { peerAddress } = req.body;
  if (!peerAddress) {
    return res.status(400).json({ error: "Alamat peer diperlukan" });
  }

  p2pService.connectToPeer(peerAddress);
  res.json({ success: true });
});

app.delete("/peers/:peerAddress", (req, res) => {
  const { peerAddress } = req.params;
  p2pService.disconnectFromPeer(peerAddress);
  res.json({ success: true });
});

// Definisikan route lainnya
// ...

// Mulai server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://${p2pService.getNodeId()}`);
  console.log(`Node ID: ${p2pService.getNodeId()}`);
});
