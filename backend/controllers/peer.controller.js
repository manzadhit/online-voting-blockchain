// controllers/peerController.js
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

// Dapatkan info node dan peer yang terhubung
const getPeers = (req, res) => {
  try {
    const p2pService = req.app.get("p2pService");
    res.json({
      nodeId: p2pService.getNodeId(),
      peers: p2pService.getConnectedPeers(),
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get peers");
  }
};

// Tambahkan peer baru
const addPeer = (req, res) => {
  try {
    const { peerAddress } = req.body;
    const p2pService = req.app.get("p2pService");

    if (!peerAddress) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Peer address is required");
    }

    p2pService.connectToPeer(peerAddress);
    res.json({
      success: true,
      message: `Successfully connected to peer: ${peerAddress}`,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// Putuskan koneksi dengan peer
const removePeer = (req, res) => {
  try {
    const { peerAddress } = req.params;
    const p2pService = req.app.get("p2pService");

    p2pService.disconnectFromPeer(peerAddress);
    res.json({
      success: true,
      message: `Successfully disconnected from peer: ${peerAddress}`,
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  getPeers,
  addPeer,
  removePeer,
};
