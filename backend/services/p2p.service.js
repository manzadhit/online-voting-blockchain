// services/p2p.service.js
const socketIo = require("socket.io");
const { getLocalIpAddress } = require("../utils/networkUtils");
const blockchainService = require("./blockchain.service");

// Menyimpan instance
let io = null;
let peers = new Map(); // Menyimpan daftar peer yang terhubung
let nodeId = null;
let connections = new Map(); // Menyimpan koneksi ke peer lain

// Inisialisasi P2P server
const init = (server) => {
  io = socketIo(server);
  nodeId = `${getLocalIpAddress()}:${process.env.PORT || 3000}`;

  io.on("connection", (socket) => {
    console.log("Peer terhubung:", socket.id);

    // Menangani registrasi peer baru
    socket.on("REGISTER_NODE", (data) => {
      const peerId = data.nodeId;
      peers.set(peerId, socket.id);
      console.log(`Node ${peerId} bergabung dalam jaringan`);
    });

    // Menangani blok baru dari peer lain
    socket.on("NEW_BLOCK", (block) => {
      console.log(
        `Menerima blok baru dari peer, blockNumber: ${block.blockNumber}`
      );

      // Validasi dan tambahkan blok ke blockchain
      const isValid = isValidNewBlock(block);

      if (isValid) {
        const blockchainData = blockchainService.getBlocks();
        blockchainData.blocks.push(block);

        // Simpan blockchain yang diperbarui
        // Perhatikan ini tergantung pada implementasi saveBlockchain di service Anda
        // Mungkin perlu tambahkan fungsi khusus di blockchainService
        fs.writeFileSync(
          path.join(__dirname, "../data/blockchain.json"),
          JSON.stringify(blockchainData, null, 2)
        );

        console.log(`Blok baru ditambahkan: ${block.blockNumber}`);
      } else {
        console.log(`Blok ditolak: tidak valid`);
      }
    });

    // Menangani disconnect
    socket.on("disconnect", () => {
      // Hapus peer dari daftar
      for (const [peerId, socketId] of peers.entries()) {
        if (socketId === socket.id) {
          peers.delete(peerId);
          console.log(`Node ${peerId} meninggalkan jaringan`);
          break;
        }
      }
    });
  });
};

// Fungsi untuk validasi blok baru
const isValidNewBlock = (newBlock) => {
  const blockchainData = blockchainService.getBlocks();
  const blocks = blockchainData.blocks;

  if (blocks.length === 0) {
    // Jika blockchain kosong, validasi genesis block
    return newBlock.blockNumber === 0;
  }

  const lastBlock = blocks[blocks.length - 1];

  // Validasi index blok
  if (lastBlock.blockNumber + 1 !== newBlock.blockNumber) {
    return false;
  }

  // Validasi previousHash
  if (lastBlock.hash !== newBlock.previousHash) {
    return false;
  }

  // Validasi hash blok
  const calculatedHash = blockchainService.calculateBlockHash(newBlock);
  if (calculatedHash !== newBlock.hash) {
    return false;
  }

  return true;
};

// Menghubungkan ke peer lain
const connectToPeer = (peerAddress) => {
  if (connections.has(peerAddress) || peerAddress === nodeId) {
    return;
  }

  console.log(`Menghubungkan ke peer: ${peerAddress}`);
  const socket = require("socket.io-client")(`http://${peerAddress}`);

  socket.on("connect", () => {
    console.log(`Terhubung ke peer: ${peerAddress}`);
    connections.set(peerAddress, socket);

    // Mendaftarkan node ini ke peer
    socket.emit("REGISTER_NODE", { nodeId });

    // Menangani event blok baru
    socket.on("NEW_BLOCK", (block) => {
      console.log(
        `Menerima blok baru dari ${peerAddress}, blockNumber: ${block.blockNumber}`
      );

      // Validasi dan tambahkan blok
      const isValid = isValidNewBlock(block);

      if (isValid) {
        const blockchainData = blockchainService.getBlocks();
        blockchainData.blocks.push(block);

        // Simpan blockchain yang diperbarui
        fs.writeFileSync(
          path.join(__dirname, "../data/blockchain.json"),
          JSON.stringify(blockchainData, null, 2)
        );

        console.log(`Blok baru ditambahkan: ${block.blockNumber}`);
      } else {
        console.log(`Blok ditolak: tidak valid`);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log(`Terputus dari peer: ${peerAddress}`);
    connections.delete(peerAddress);
  });

  return socket;
};

// Memutuskan koneksi dengan peer
const disconnectFromPeer = (peerAddress) => {
  if (connections.has(peerAddress)) {
    const socket = connections.get(peerAddress);
    socket.disconnect();
    connections.delete(peerAddress);
    console.log(`Terputus dari peer: ${peerAddress}`);
  }
};

// Mendapatkan daftar peer yang terhubung
const getConnectedPeers = () => {
  const serverPeers = Array.from(peers.keys());
  const clientPeers = Array.from(connections.keys());

  // Gabungkan daftar peer dan hapus duplikat
  return [...new Set([...serverPeers, ...clientPeers])];
};

// Mendapatkan ID node
const getNodeId = () => {
  return nodeId;
};

// Broadcast blok baru ke semua peer
const broadcastNewBlock = (block) => {
  console.log(`Broadcasting blok baru: ${block.blockNumber}`);

  // Broadcast melalui server ke peer yang terhubung ke node ini
  if (io) {
    io.emit("NEW_BLOCK", block);
  }

  // Broadcast ke peer yang node ini terhubung
  for (const [peerAddress, socket] of connections.entries()) {
    console.log(`Mengirim blok baru ke ${peerAddress}`);
    socket.emit("NEW_BLOCK", block);
  }
};

module.exports = {
  init,
  connectToPeer,
  disconnectFromPeer,
  broadcastNewBlock,
  getNodeId,
  getConnectedPeers,
};
