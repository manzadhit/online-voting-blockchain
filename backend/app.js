// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const router = require("./routes");
const errorHandler = require("./middleware/errorHandler")
const fs = require("fs");
const { initializeBlockchain } = require("./services/blockchain.service");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

initializeBlockchain();

// API Routes
app.use(router)



const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

app.use(errorHandler);

// Sample data initialization
const initSampleData = () => {
  const blockchainPath = path.join(dataDir, 'blockchain.json');
  const electionsPath = path.join(dataDir, 'elections.json');
  const votersPath = path.join(dataDir, 'voters.json');
  
  // Initialize blockchain data
  if (!fs.existsSync(blockchainPath)) {
    fs.writeFileSync(blockchainPath, JSON.stringify({ blocks: [] }, null, 2));
  }
  
  // Initialize elections data
  if (!fs.existsSync(electionsPath)) {
    const elections = {
      elections: [
        {
          id: 'election1',
          name: 'Pemilihan Ketua & Wakil Ketua Dewan Mahasiswa 2025',
          isActive: true,
          startDate: '2025-04-01T00:00:00.000Z',
          endDate: '2025-04-05T23:59:59.999Z',
          candidates: [
            {
              id: 'candidate1',
              mainCandidate: {
                name: 'Andi Pratama',
                initials: 'AP',
                faculty: 'Fakultas Ilmu Komputer'
              },
              deputyCandidate: {
                name: 'Rina Indah',
                initials: 'RI',
                faculty: 'Fakultas MIPA'
              },
              vision: 'Menciptakan ekosistem mahasiswa yang inovatif, kolaboratif dan berbasis teknologi untuk keunggulan akademik dan karier.',
              voteCount: 0
            },
            {
              id: 'candidate2',
              mainCandidate: {
                name: 'Sarah Ramadhani',
                initials: 'SR',
                faculty: 'Fakultas Ekonomi'
              },
              deputyCandidate: {
                name: 'Fajar Aditya',
                initials: 'FA',
                faculty: 'Fakultas Sosial Politik'
              },
              vision: 'Membangun kampus inklusif dengan fokus pada pengembangan softskill dan kewirausahaan mahasiswa untuk masa depan berkelanjutan.',
              voteCount: 0
            },
            {
              id: 'candidate3',
              mainCandidate: {
                name: 'Budi Hartono',
                initials: 'BH',
                faculty: 'Fakultas Hukum'
              },
              deputyCandidate: {
                name: 'Lisa Wijaya',
                initials: 'LW',
                faculty: 'Fakultas Humaniora'
              },
              vision: 'Mewujudkan tata kelola organisasi kemahasiswaan yang transparan dan berintegritas dengan pendekatan advokasi berbasis data.',
              voteCount: 0
            },
            {
              id: 'candidate4',
              mainCandidate: {
                name: 'Diana Putri',
                initials: 'DP',
                faculty: 'Fakultas Kedokteran'
              },
              deputyCandidate: {
                name: 'Reza Saputra',
                initials: 'RS',
                faculty: 'Fakultas Teknik'
              },
              vision: 'Mengembangkan kapasitas mahasiswa dalam bidang kesehatan dan teknologi untuk menciptakan solusi inovatif bagi masyarakat.',
              voteCount: 0
            }
          ]
        }
      ]
    };
    fs.writeFileSync(electionsPath, JSON.stringify(elections, null, 2));
  }
  
  // Initialize voters data
  if (!fs.existsSync(votersPath)) {
    const voters = {
      voters: [
        {
          id: 'voter1',
          name: 'Mahasiswa Sejati',
          nim: '22301234',
          faculty: 'Fakultas Ilmu Komputer',
          votedElections: []
        }
      ]
    };
    fs.writeFileSync(votersPath, JSON.stringify(voters, null, 2));
  }
};

// Initialize sample data
initSampleData();


// Start server
app.listen(PORT, () => {  
  console.log(`BlockVote backend running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser`);
});
