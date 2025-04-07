const io = require("socket.io-client");
const { getLocalIpAddress } = require("../utils/networkUtils");

class P2PConnection {
  constructor(blockchainService) {
    this.connections = new Map(); // Menyimpan koneksi ke peer lain
    this.blockchainService = blockchainService;
    this.nodeId = `${getLocalIpAddress()}:${process.env.PORT || 3000}`;
  }

  // Terhubung ke peer lain
  connectToPeer(peerAddress) {
    if (this.connections.has(peerAddress) || peerAddress === this.nodeId) {
      return;
    }

    console.log(`Menghubungkan ke peer: ${peerAddress}`);
    const socket = io(`http://${peerAddress}`);

    socket.on("connect", () => {
      console.log(`Terhubung ke peer: ${peerAddress}`);
      this.connections.set(peerAddress, socket);

      // Mendaftarkan node ini ke peer
      socket.emit("REGISTER_NODE", { nodeId: this.nodeId });

      // Menangani event block baru
      socket.on("NEW_BLOCK", (block) => {
        console.log(
          `Menerima blok baru dari ${peerAddress}, index: ${block.index}`
        );
        // Validasi dan tambahkan blok
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
    });

    socket.on("disconnect", () => {
      console.log(`Terputus dari peer: ${peerAddress}`);
      this.connections.delete(peerAddress);
    });

    return socket;
  }

  // Memutuskan koneksi dengan peer
  disconnectFromPeer(peerAddress) {
    if (this.connections.has(peerAddress)) {
      const socket = this.connections.get(peerAddress);
      socket.disconnect();
      this.connections.delete(peerAddress);
      console.log(`Terputus dari peer: ${peerAddress}`);
    }
  }

  // Mengirim blok baru ke semua peer
  broadcastNewBlock(block) {
    for (const [peerAddress, socket] of this.connections.entries()) {
      console.log(`Mengirim blok baru ke ${peerAddress}`);
      socket.emit("NEW_BLOCK", block);
    }
  }

  getConnectedPeers() {
    return Array.from(this.connections.keys());
  }
}

module.exports = P2PConnection;
