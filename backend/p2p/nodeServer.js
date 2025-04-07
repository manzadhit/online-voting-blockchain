const socketIo = require("socket.io");
const { getLocalIpAddress } = require("../utils/networkUtils");

class NodeServer {
  constructor(server, blockchainService) {
    this.io = socketIo(server);
    this.blockchainService = blockchainService;
    this.peers = new Map(); // Menyimpan daftar peer yang terhubung
    this.nodeId = `${getLocalIpAddress()}:${process.env.PORT || 3000}`;

    this.init();
  }

  init() {
    this.io.on("connection", (socket) => {
      console.log("Peer terhubung:", socket.id);

      // Menangani registrasi peer baru
      socket.on("REGISTER_NODE", (data) => {
        const peerId = data.nodeId;
        this.peers.set(peerId, socket.id);
        console.log(`Node ${peerId} bergabung dalam jaringan`);
      });

      // Menangani blok baru dari peer lain
      socket.on("NEW_BLOCK", (block) => {
        console.log(`Menerima blok baru dari peer, index: ${block.index}`);
        // Validasi dan tambahkan blok ke blockchain
        const blockchain = this.blockchainService.getBlockchain();
        const isValid = blockchain.isValidNewBlock(block);

        if (isValid) {
          blockchain.chain.push(block);
          this.blockchainService.saveBlockchain(blockchain);
          console.log(`Blok baru ditambahkan: ${block.index}`);
        } else {
          console.log(`Blok ditolak: tidak valid`);
        }
      });

      // Menangani disconnect
      socket.on("disconnect", () => {
        // Hapus peer dari daftar
        for (const [peerId, socketId] of this.peers.entries()) {
          if (socketId === socket.id) {
            this.peers.delete(peerId);
            console.log(`Node ${peerId} meninggalkan jaringan`);
            break;
          }
        }
      });
    });
  }

  // Mengirim blok baru ke semua peer
  broadcastNewBlock(block) {
    console.log(`Broadcasting blok baru: ${block.index}`);
    this.io.emit("NEW_BLOCK", block);
  }

  getNodeId() {
    return this.nodeId;
  }

  getPeers() {
    return Array.from(this.peers.keys());
  }
}

module.exports = NodeServer;
