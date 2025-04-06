// routes/blockchainRoutes.js
const express = require("express");
const blockchainController = require("../controllers/blockchain.controller");

const router = express.Router();

router.get("/", blockchainController.getBlocks);
router.get("/:blockNumber", blockchainController.getBlockByNumber);
router.get(
  "/:blockNumber/verify",
  blockchainController.verifyBlockIntegrity
);

module.exports = router;
