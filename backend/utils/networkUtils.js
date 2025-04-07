const os = require("os");

// Mendapatkan alamat IP lokal
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const iface of interfaceInfo) {
      // Hanya ambil IPv4 dan bukan loopback
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1"; // Fallback ke localhost
}

module.exports = {
  getLocalIpAddress,
};
