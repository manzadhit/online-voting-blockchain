# Dokumentasi Website - Sistem Voting Blockchain

Repositori ini berisi kode untuk aplikasi web sistem voting berbasis blockchain dengan komponen backend dan frontend yang terpisah.

## Persyaratan

- Node.js dan npm
- MetaMask (untuk interaksi dengan blockchain)
- Ganache (untuk development lokal) atau akses ke Sepolia Testnet
- Editor kode (Visual Studio Code direkomendasikan dengan ekstensi Live Server)

## Memulai

Ikuti langkah-langkah berikut untuk menyiapkan dan menjalankan aplikasi secara lokal:

### Pengaturan Backend

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables (.env)**
   
   Buat file `.env` di dalam folder `backend` dengan konfigurasi berikut:

   ```env
   # Database Configuration (SupaBase)
   DATABASE_URL=""
   DIRECT_URL=""

   # Sepolia Testnet Configuration
   SEPOLIA_CONTRACT_ADDRESS=""
   SEPOLIA_PRIVATE_KEY=""
   SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/your_api_key"

   # Ganache Local Configuration  
   GANACHE_CONTRACT_ADDRESS=""
   GANACHE_PRIVATE_KEY=""
   GANACHE_RPC_URL="http://127.0.0.1:7545"
   ```

   **Pengisian Environment Variables:**
   
   - `DATABASE_URL` dan `DIRECT_URL`: Dapatkan dari dashboard SupaBase Anda
   - `SEPOLIA_CONTRACT_ADDRESS`: Alamat smart contract yang sudah di-deploy ke Sepolia
   - `SEPOLIA_PRIVATE_KEY`: Private key akun Ethereum untuk Sepolia (tanpa prefix 0x)
   - `SEPOLIA_RPC_URL`: Ganti `your_api_key` dengan API key Infura Anda
   - `GANACHE_CONTRACT_ADDRESS`: Alamat smart contract di Ganache lokal
   - `GANACHE_PRIVATE_KEY`: Private key dari akun Ganache
   - `GANACHE_RPC_URL`: URL RPC Ganache (default: http://127.0.0.1:7545)

4. **Konfigurasi Service Layer**

   Di file `backend/services/student.service.js`, pastikan menggunakan environment variables yang sesuai dengan jaringan yang ingin digunakan:

   ```javascript
   // Untuk Sepolia Testnet
   const CONTRACT_ADDRESS = process.env.SEPOLIA_CONTRACT_ADDRESS;
   const ADMIN_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
   const RPC_URL = process.env.SEPOLIA_RPC_URL;

   // Atau untuk Ganache (development lokal)
   // const CONTRACT_ADDRESS = process.env.GANACHE_CONTRACT_ADDRESS;
   // const ADMIN_PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;
   // const RPC_URL = process.env.GANACHE_RPC_URL;
   ```

5. Upload Schema ke Database:
   ```bash
   npx prisma db push
   ```

6. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

7. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

### Pengaturan Blockchain

Sistem ini mendukung dua jaringan blockchain:
- **Sepolia Testnet** (untuk production/testing)
- **Ganache** (untuk development lokal)

#### Deploy Smart Contract (jika diperlukan)

Jika Anda perlu deploy ulang smart contract:

```bash
# Masuk ke folder backend (jika belum)
cd backend

# Deploy ke Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Deploy ke Ganache (pastikan Ganache sudah berjalan)
npx hardhat run scripts/deploy.js --network ganache
```

Setelah deployment, update `CONTRACT_ADDRESS` di file `.env` dengan alamat contract yang baru.

#### Konfigurasi Frontend

**Update Contract Address**

Di file `frontend/assets/scripts/blockchain.js`, update alamat contract sesuai dengan yang digunakan:

```javascript
// Untuk Sepolia Testnet
const CONTRACT_ADDRESS = "0xC899591c3c4213b36b2e55507ac315D768F3D6cd";

// Atau sesuaikan dengan contract address yang sedang digunakan
```

#### Switching Network

Untuk beralih antara Sepolia dan Ganache:

1. **Backend**: Update variable environment di `student.service.js`
2. **Frontend**: Update `CONTRACT_ADDRESS` di `blockchain.js`
3. **Database**: Pastikan data di database sesuai dengan jaringan yang digunakan

#### Troubleshooting

- **Ganache tidak terdeteksi**: Pastikan Ganache berjalan di port 7545
- **Transaction gagal**: Periksa apakah private key memiliki ETH yang cukup
- **Contract tidak ditemukan**: Pastikan contract address sudah benar dan contract sudah di-deploy
- **Environment variables tidak terbaca**: Pastikan file `.env` berada di folder `backend` dan tidak ada typo pada nama variable

### Pengaturan Frontend

Frontend terdiri dari file HTML yang terletak di folder `frontend`. Untuk menjalankannya:

1. Buka file HTML menggunakan Live Server.
   - Jika Anda menggunakan Visual Studio Code, Anda bisa menginstal ekstensi "Live Server"
   - Klik kanan pada file HTML di folder `frontend` dan pilih "Open with Live Server"

## Struktur Proyek

```
online-voting-system-blockchain/
├── backend/                    # Server-side code
│   ├── contracts/             # Smart contracts
│   ├── artifacts/             # Compiled contracts
│   ├── services/              # Business logic
│   ├── controllers/           # API endpoints
│   ├── routes/               # API routes
│   ├── scripts/              # Deployment scripts
│   ├── .env                  # Environment variables (buat file ini)
│   └── ...
├── frontend/                  # Client-side code
│   ├── assets/
│   │   ├── css/              # Stylesheets
│   │   └── scripts/          # JavaScript files
│   └── *.html                # HTML pages
└── README.md
```

## Catatan Keamanan

⚠️ **Penting**: 
- Jangan pernah commit private key ke repository public
- Pastikan file `.env` sudah ada di `.gitignore`
- Gunakan private key yang berbeda untuk development dan production
- Simpan private key dengan aman dan jangan bagikan ke orang lain

## Langkah-langkah Lengkap Setup

1. **Clone repository**
2. **Setup Backend:**
   - `cd backend`
   - `npm install`
   - Buat file `.env` dengan konfigurasi yang sesuai
   - Konfigurasi `student.service.js` untuk jaringan yang diinginkan
   - `npx prisma db push`
   - `npx prisma generate`
   - `npm run dev`
3. **Setup Frontend:**
   - Update contract address di `blockchain.js`
   - Buka file HTML dengan Live Server
4. **Setup MetaMask:**
   - Tambahkan jaringan yang sesuai (Sepolia/Ganache)
   - Import akun dengan private key yang sesuai