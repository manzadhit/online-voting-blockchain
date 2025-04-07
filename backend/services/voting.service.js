const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const blockchainService = require("./blockchain.service");
const prisma = require("../prisma/client");

const BLOCKCHAIN_FILE = path.join(__dirname, "../data/blockchain.json");

// Ambil pemilu yang aktif
const getActiveElections = async () => {
  const now = new Date();

  const elections = await prisma.election.findMany({
    where: {
      isActive: true,
      endDate: { gt: now },
    },
    include: {
      candidates: true,
    },
  });

  return elections;
};

// Ambil informasi pemilih berdasarkan studentId (voterId)
const getVoterInfo = async (voterId) => {
  const student = await prisma.student.findUnique({
    where: { id: voterId },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Voter not found");
  }

  return student;
};

// Submit vote dan simpan ke blockchain
const submitVote = async (voterId, candidateId, electionId) => {
  const election = await prisma.election.findUnique({
    where: { id: electionId },
    include: {
      candidates: true,
    },
  });

  if (!election) {
    throw new ApiError(httpStatus.NOT_FOUND, "Election not found");
  }

  const now = new Date();
  if (new Date(election.endDate) < now || !election.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Election is not active");
  }

  const hashedVoterId = crypto
    .createHash("sha256")
    .update(voterId)
    .digest("hex");
  const hashedElectionId = crypto
    .createHash("sha256")
    .update(electionId)
    .digest("hex");

  const blockchainData = readData(BLOCKCHAIN_FILE);
  const hasVoted = blockchainData.blocks?.some((block) =>
    block.transactions?.some(
      (tx) => tx.voterId === hashedVoterId && tx.electionId === hashedElectionId
    )
  );

  if (hasVoted) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Voter has already voted in this election"
    );
  }

  const transaction = {
    id: `0x${crypto.randomBytes(2).toString("hex")}`,
    timestamp: new Date().toISOString(),
    voterId: hashedVoterId,
    vote: crypto.createHash("sha256").update(candidateId).digest("hex"),
    electionId: hashedElectionId,
    signature: crypto.randomBytes(5).toString("hex"),
  };

  const block = await blockchainService.createBlock(transaction);

  const p2pService = require("./p2p.service");
  p2pService.broadcastNewBlock(block);

  return {
    transaction,
    block: {
      number: block.number,
      hash: block.hash,
    },
  };
};

// Hasil voting dari blockchain
const getResult = async (electionId) => {
  const blockchainData = readData(BLOCKCHAIN_FILE);
  const totalVoter = await prisma.student.count();

  const hashedElectionId = crypto
    .createHash("sha256")
    .update(electionId)
    .digest("hex");

  const totalVote = blockchainData.blocks?.reduce((acc, block) => {
    const voteCountForThisBlock =
      block.transactions?.filter((tx) => tx.electionId === hashedElectionId)
        .length || 0;
    return acc + voteCountForThisBlock;
  }, 0);

  const election = await prisma.election.findUnique({
    where: { id: electionId },
  });

  const votingCountDown = getVotingCountdown(election.endDate);

  const candidates = await prisma.candidate.findMany({
    where: { electionId },
  });

  const results = candidates.map((candidate) => {
    const voteCount = blockchainService.getVoteCount(electionId, candidate.id);

    const percentage =
      totalVote > 0 ? ((voteCount / totalVote) * 100).toFixed(1) : "0.0";

    return {
      ...candidate,
      voteCount,
      percentage: parseFloat(percentage),
    };
  });

  const maxVote = Math.max(...results.map((c) => c.voteCount));
  results.forEach((candidate) => {
    candidate.status = candidate.voteCount === maxVote ? "Memimpin" : "-";
  });

  const participationRate =
    totalVoter > 0 ? ((totalVote / totalVoter) * 100).toFixed(1) : "0.0";

  const electionName = election.name;
  return {
    totalVoter,
    totalVote,
    participationRate,
    votingCountDown,
    electionName,
    candidates: results,
  };
};

function readData(filePath) {
  try {
    if (!fs.existsSync(filePath)) return { blocks: [] };
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Error reading blockchain data`
    );
  }
}

const getVoteCount = (electionId, candidateId) => {
  const blockchainData = readData(BLOCKCHAIN_FILE);

  const hashedElectionId = crypto
    .createHash("sha256")
    .update(electionId)
    .digest("hex");

  const hashedCandidateId = crypto
    .createHash("sha256")
    .update(candidateId)
    .digest("hex");

  const voteCount = blockchainData.blocks?.reduce((acc, block) => {
    const votes =
      block.transactions?.filter(
        (tx) =>
          tx.electionId === hashedElectionId && tx.vote === hashedCandidateId
      ).length || 0;
    return acc + votes;
  }, 0);

  return voteCount;
};

function getVotingCountdown(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const timeLeftMs = end - now;

  if (timeLeftMs <= 0) return "00:00:00";

  const totalSeconds = Math.floor(timeLeftMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

module.exports = {
  getActiveElections,
  getVoterInfo,
  submitVote,
  getResult,
  getVoteCount,
};
