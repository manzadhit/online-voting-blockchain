// routes/peerRoutes.js
const express = require("express");
const router = express.Router();
const peerController = require("../controllers/peer.controller");

// Mendapatkan daftar peer yang terhubung
router.get("/", peerController.getPeers);

// Menambahkan peer baru
router.post("/", peerController.addPeer);

// Memutuskan koneksi dengan peer
router.delete("/:peerAddress", peerController.removePeer);

module.exports = router;
