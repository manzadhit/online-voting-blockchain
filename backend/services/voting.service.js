// services/votingService.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const blockchainService = require("./blockchain.service");

// Paths to data files
const ELECTIONS_FILE = path.join(__dirname, "../data/elections.json");
const VOTERS_FILE = path.join(__dirname, "../data/voters.json");
const BLOCKCHAIN_FILE = path.join(__dirname, "../data/blockchain.json");

// Helper functions to read and write data
const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      const defaultData = filePath.includes("elections")
        ? { elections: [] }
        : { voters: [] };
      fs.writeFileSync(filePath, JSON.stringify(defaultData));
      return defaultData;
    }
    const data = fs.readFileSync(filePath, "utf8");
    
    return JSON.parse(data);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Error reading data from ${filePath}`
    );
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Error writing data to ${filePath}`
    );
  }
};

// Get active elections
const getActiveElections = async () => {
  const { elections } = readData(ELECTIONS_FILE);
  
  const now = new Date();
  const election = elections.filter((election) => {
    const endDate = new Date(election.endDate);
    return endDate > now && election.isActive;
  });

  return election;
};

// Get voter information
const getVoterInfo = async (voterId) => {
  const { voters } = readData(VOTERS_FILE);
  const voter = voters.find((v) => v.id === voterId);

  if (!voter) {
    throw new ApiError(httpStatus.NOT_FOUND, "Voter not found");
  }

  return voter;
};

// Submit a vote
const submitVote = async (voterId, candidateId, electionId) => {
  // Get the voter and election data
  const votersData = readData(VOTERS_FILE);
  const electionsData = readData(ELECTIONS_FILE);

  // const voter = votersData.voters.find((v) => v.id === voterId);
  // if (!voter) {
  //   throw new ApiError(httpStatus.NOT_FOUND, "Voter not found");
  // }

  const election = electionsData.elections.find((e) => e.id === electionId);
  if (!election) {
    throw new ApiError(httpStatus.NOT_FOUND, "Election not found");
  }

  // Check if the election is still active
  const now = new Date();
  const endDate = new Date(election.endDate);
  if (endDate < now || !election.isActive) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Election is not active");
  }

  // Hash voterId and electionId
  const hashedVoterId = crypto
    .createHash("sha256")
    .update(voterId)
    .digest("hex");
  const hashedElectionId = crypto
    .createHash("sha256")
    .update(electionId)
    .digest("hex");

  // Check on blockchain if this voter has already voted in this election
  const blockchainData = readData(BLOCKCHAIN_FILE); // Pastikan ini sesuai nama file blockchain JSON
  const hasVoted = blockchainData.blocks?.some((block) =>
    block.transactions?.some(
      (tx) => tx.voterId === hashedVoterId && tx.electionId === hashedElectionId
    )
  );

  if (hasVoted) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Voter has already voted in this election (verified on blockchain)"
    );
  }

  // Local check in voter record (opsional kalau blockchain sudah cukup)
  // if (voter.votedElections && voter.votedElections.includes(electionId)) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     "Voter has already voted in this election"
  //   );
  // }

  // Create the transaction
  const transaction = {
    id: `0x${crypto.randomBytes(2).toString("hex")}`,
    timestamp: new Date().toISOString(),
    voterId: hashedVoterId, // Hash for privacy
    vote: crypto.createHash("sha256").update(candidateId).digest("hex"),
    electionId: hashedElectionId,
    signature: crypto.randomBytes(5).toString("hex"),
  };

  // Create a new block with this transaction
  const block = await blockchainService.createBlock(transaction);

  // Update voter's record to mark that they've voted
  // if (!voter.votedElections) {
  //   voter.votedElections = [];
  // }
  // voter.votedElections.push(electionId);

  // Update vote count (can be hidden until election ends)
  const candidateIndex = election.candidates.findIndex(
    (c) => c.id === candidateId
  );
  if (candidateIndex !== -1) {
    if (!election.candidates[candidateIndex].voteCount) {
      election.candidates[candidateIndex].voteCount = 0;
    }
    election.candidates[candidateIndex].voteCount += 1;
  }

  // Save updated data
  writeData(VOTERS_FILE, votersData);
  writeData(ELECTIONS_FILE, electionsData);

  // Return transaction and block info
  return {
    transaction,
    block: {
      number: block.number,
      hash: block.hash,
    },
  };
};


module.exports = {
  getActiveElections,
  getVoterInfo,
  submitVote,
};
