const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const ethers = require("ethers");
require("dotenv").config();

const ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "VotedCasted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voterAddress",
        type: "address",
      },
    ],
    name: "addVoterToWhiteList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allVotes",
    outputs: [
      {
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "candidateId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "electionId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newAdmin",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_candidateIds",
        type: "uint256[]",
      },
    ],
    name: "getAllCandidateVoteCount",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "getElectionVoteCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isWhiteListed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_electionId",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "voteCounts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const CONTRACT_ADDRESS = process.env.SEPOLIA_CONTRACT_ADDRESS;
const ADMIN_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const RPC_URL = process.env.SEPOLIA_RPC_URL;

// Atau untuk Ganache (development lokal)
// const CONTRACT_ADDRESS = process.env.GANACHE_CONTRACT_ADDRESS;
// const ADMIN_PRIVATE_KEY = process.env.GANACHE_PRIVATE_KEY;
// const RPC_URL = process.env.GANACHE_RPC_URL;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
const contractWithAdminSigner = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  adminWallet
);

const getAllStudents = async () => {
  return await prisma.student.findMany();
};

const getStudentByNIM = async (nim) => {
  const student = await prisma.student.findUnique({
    where: { nim },
  });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return student;
};

const createStudent = async (nim, name, faculty, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.student.create({
    data: {
      nim,
      name,
      faculty,
      password: hashedPassword,
    },
  });
};

const updateStudent = async (nim, updatedData) => {
  // Jika password diupdate, hash password baru

  await getStudentByNIM(nim);

  if (updatedData.password) {
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
  }

  const updatedStudent = await prisma.student.update({
    where: {
      nim,
    },
    data: updatedData,
  });

  return updatedStudent;
};

const deleteStudent = async (nim) => {
  await getStudentByNIM(nim);

  const deletedStudent = await prisma.student.delete({
    where: { nim },
  });
  return deletedStudent;
};

const loginStudent = async (nim, password) => {
  // Mencari mahasiswa berdasarkan nim
  const student = await prisma.student.findUnique({
    where: { nim },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mahasiswa tidak ditemukan.");
  }

  // Membandingkan password yang dimasukkan dengan yang tersimpan
  const isPasswordValid = await bcrypt.compare(password, student.password);

  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password yang dimasukkan salah."
    );
  }

  return student;
};

const resetPassword = async (nim, oldPassword, newPassword) => {
  // Mencari mahasiswa berdasarkan nim
  const student = await prisma.student.findUnique({
    where: { nim },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mahasiswa tidak ditemukan.");
  }

  // Verifikasi password lama
  const isOldPasswordValid = await bcrypt.compare(
    oldPassword,
    student.password
  );

  if (!isOldPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password lama tidak benar.");
  }

  // Pastikan password baru tidak sama dengan password lama
  const isSamePassword = await bcrypt.compare(newPassword, student.password);

  if (isSamePassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Password baru harus berbeda dengan password lama."
    );
  }

  // Hash password baru
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password mahasiswa
  const updatedStudent = await prisma.student.update({
    where: { nim },
    data: {
      password: hashedPassword,
    },
  });

  return updatedStudent;
};

const addWalletAddress = async (nim, walletAddress, password) => {
  const student = await getStudentByNIM(nim);

  const isPasswordValid = await bcrypt.compare(password, student.password);
  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password yang Anda masukkan salah."
    );
  }

  if (student.walletAddress) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Anda sudah pernah mendaftarkan alamat dompet."
    );
  }

  const alreadyRegisterWalletAdress = await prisma.student.findUnique({
    where: {
      walletAddress,
    },
  });

  if (alreadyRegisterWalletAdress) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Alamat dompet ini sudah terdaftar oleh pengguna lain."
    );
  }

  await whiteListWalletAddress(walletAddress);

  const studentUpdated = await prisma.student.update({
    where: {
      id: student.id,
    },
    data: {
      walletAddress,
    },
  });

  return studentUpdated;
};


const whiteListWalletAddress = async (walletAddress) => {
  const normalizedAddress = ethers.getAddress(walletAddress);
  const isWhiteListed = await contractWithAdminSigner.isWhiteListed(
    normalizedAddress
  );

  if(isWhiteListed) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Alamat dompet ini sudah terdaftar di Blockchain."
    );
  }

  const tx = await contractWithAdminSigner.addVoterToWhiteList(
    normalizedAddress
  );
  await tx.wait();
};

module.exports = {
  getAllStudents,
  getStudentByNIM,
  createStudent,
  updateStudent,
  deleteStudent,
  loginStudent,
  resetPassword,
  addWalletAddress,
  whiteListWalletAddress,
};
