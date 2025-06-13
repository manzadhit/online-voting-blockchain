const blockchainService = require("../services/blockchain.service");
const votingService = require("../services/voting.service");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const voteOnBlockchain = catchAsync(async (req, res) => {
  const { voterId, candidateId, electionId } = req.body;

  // Check if voter already voted in database
  const hasVoted = await votingService.hasVoterVoted(electionId, voterId);
  
  if (hasVoted) {
    throw new ApiError(400, "Voter has already voted in this election");
  }

  // Get voter's wallet address from database or generate one
  // For now, we'll use a deterministic address based on voterId
  // In production, you might want to store actual wallet addresses
  const voterAddress =
    req.body.voterAddress || process.env.DEFAULT_VOTER_ADDRESS;

  // Check if voter already voted on blockchain
  const hasVotedBlockchain = await blockchainService.hasVoted(
    voterAddress,
    electionId
  );
  if (hasVotedBlockchain) {
    throw new ApiError(400, "Voter has already voted on blockchain");
  }

  // Vote on blockchain
  const blockchainResult = await blockchainService.vote(
    electionId,
    candidateId
  );

  // Update database
  await votingService.recordVote(
    voterId,
    candidateId,
    electionId,
    blockchainResult.txHash
  );

  res.status(200).json({
    status: 200,
    message: "Vote recorded successfully",
    data: {
      txHash: blockchainResult.txHash,
      voterId: voterId,
      candidateId: candidateId,
      electionId: electionId,
    },
  });
});

const getCandidateVoteCount = catchAsync(async (req, res) => {
  const { candidateId } = req.params;

  const voteCount = await blockchainService.getCandidateVoteCount(candidateId);

  res.status(200).json({
    status: 200,
    data: { candidateId, voteCount },
  });
});

const getElectionResults = catchAsync(async (req, res) => {
  const { electionId } = req.params;
  const { candidateIds } = req.body; // Array of candidate IDs

  const results = await blockchainService.getElectionResults(
    electionId,
    candidateIds
  );

  res.status(200).json({
    status: 200,
    data: {
      electionId,
      results: results.candidateIds.map((id, index) => ({
        candidateId: id,
        voteCount: results.voteCounts[index],
      })),
    },
  });
});

const getVoterStatus = catchAsync(async (req, res) => {
  const { voterId, electionId } = req.params;
  const { voterAddress } = req.query;

  // Use provided address or default
  const address = voterAddress || process.env.DEFAULT_VOTER_ADDRESS;

  const hasVoted = await blockchainService.hasVoted(address, electionId);

  res.status(200).json({
    status: 200,
    data: { voterId, electionId, hasVoted },
  });
});

const getElectionVotes = catchAsync(async (req, res) => {
  const { electionId } = req.params;

  const votes = await blockchainService.getVotesByElection(electionId);

  res.status(200).json({
    status: 200,
    data: { electionId, votes },
  });
});

const getAllVotes = catchAsync(async (req, res) => {
  const votes = await blockchainService.getAllVotes();

  res.status(200).json({
    status: 200,
    data: { votes },
  });
});

const getTransactionDetails = catchAsync(async (req, res) => {
  const { txHash } = req.params;

  const details = await blockchainService.getTransactionDetails(txHash);

  res.status(200).json({
    status: 200,
    data: details,
  });
});

module.exports = {
  voteOnBlockchain,
  getCandidateVoteCount,
  getElectionResults,
  getVoterStatus,
  getElectionVotes,
  getAllVotes,
  getTransactionDetails,
};
