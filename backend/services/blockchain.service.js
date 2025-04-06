// services/blockchainService.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

// Path to the blockchain data file
const BLOCKCHAIN_FILE = path.join(__dirname, "../data/blockchain.json");

// Helper function to read blockchain data
const readBlockchainData = () => {
  try {
    if (!fs.existsSync(BLOCKCHAIN_FILE)) {
      // Create file with empty blockchain if it doesn't exist
      fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify({ blocks: [] }));
      return { blocks: [] };
    }
    const data = fs.readFileSync(BLOCKCHAIN_FILE, "utf8");
    
    return JSON.parse(data);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error reading blockchain data"
    );
  }
};

// Helper function to write blockchain data
const writeBlockchainData = (data) => {
  try {
    fs.writeFileSync(BLOCKCHAIN_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error writing blockchain data"
    );
  }
};

const createGenesisBlock = () => {
  const genesisTransaction = {
    id: "0xgenesis",
    timestamp: new Date().toISOString(),
    voterId: "0x0",
    vote: "Genesis Block",
    electionId: "0x0",
    signature: "0x0",
  };

  const genesisBlock = {
    blockNumber: 0,
    previousHash: "0x0",
    timestamp: new Date().toISOString(),
    transactions: [genesisTransaction],
    nonce: Math.floor(Math.random() * 1000000),
  };

  genesisBlock.hash = calculateBlockHash(genesisBlock);

  return genesisBlock;
};

const initializeBlockchain = () => {
  if (!fs.existsSync(BLOCKCHAIN_FILE)) {
    const genesisBlock = createGenesisBlock();
    const blockchain = { blocks: [genesisBlock] };
    writeBlockchainData(blockchain);
    console.log("✅ Genesis block created and blockchain initialized.");
  }
};

// Get all blocks
const getBlocks = async () => {
  const blockchain = readBlockchainData();
  
  return blockchain;
};

// Get a specific block by its number
const getBlockByNumber = async (blockNumber) => {
  const blockchain = readBlockchainData();
  const block = blockchain.blocks.find((b) => b.blockNumber === blockNumber);

  if (!block) {
    throw new ApiError(httpStatus.NOT_FOUND, "Block not found");
  }

  return block;
};

// Calculate hash for a block
const calculateBlockHash = (block) => {
  const blockData = {
    blockNumber: block.blockNumber,
    timestamp: block.timestamp,
    previousHash: block.previousHash,
    transactions: block.transactions,
    nonce: block.nonce,
  };

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(blockData))
    .digest("hex");
};

// Verify the integrity of a block
// Verify the integrity of a block
const verifyBlockIntegrity = (blockNumber) => {
  const blockchain = readBlockchainData();
  const currentBlock = blockchain.blocks.find((b) => b.blockNumber === blockNumber);

  // 1. Verifikasi hash block saat ini
  const isCurrentHashValid =
    calculateBlockHash(currentBlock) === currentBlock.hash;
  if (!isCurrentHashValid) return false;

  // 2. Verifikasi link ke block sebelumnya (kecuali genesis block)
  if (blockNumber > 1) {
    const previousBlock = blockchain.blocks.find(
      (b) => b.blockNumber === blockNumber - 1
    );
    const isLinkValid = currentBlock.previousHash === previousBlock.hash;
    if (!isLinkValid) return false;
  }

  return true; // Semua valid
};

// Create a new block with the given transaction
const createBlock = async (transaction) => {
  const blockchain = readBlockchainData();
  
  const blocks = blockchain.blocks;  

  const previousBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;
  const previousHash = previousBlock ? previousBlock.hash : "0".repeat(64);
  const blockNumber = previousBlock ? previousBlock.blockNumber + 1 : 1;

  // Create a new block
  const newBlock = {
    blockNumber: blockNumber,
    timestamp: new Date().toISOString(),
    previousHash,
    transactions: [transaction],
    nonce: Math.floor(Math.random() * 1000000), // Simplified for demo
  };

  // Calculate hash for the new block
  newBlock.hash = calculateBlockHash(newBlock);

  // Add the new block to the blockchain
  blocks.push(newBlock);
  writeBlockchainData({ blocks });

  return newBlock;
};

module.exports = {
  getBlocks,
  getBlockByNumber,
  verifyBlockIntegrity,
  createBlock,
  initializeBlockchain,
};
