// controllers/votingController.js
const httpStatus = require("http-status");
const votingService = require("../services/voting.service");
const catchAsync = require("../utils/catchAsync");

const getActiveElections = catchAsync(async (req, res) => {
  const elections = await votingService.getActiveElections();
  
  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Active elections retrieved successfully",
    data: elections,
  });
});

const getVoterInfo = catchAsync(async (req, res) => {
  const { voterId } = req.params;
  const voter = await votingService.getVoterInfo(voterId);
  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Voter information retrieved successfully",
    data: voter,
  });
});

const submitVote = catchAsync(async (req, res) => {
  const { voterId, candidateId, electionId } = req.body;
  const transaction = await votingService.submitVote(
    voterId,
    candidateId,
    electionId
  );
  
  return res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Vote submitted successfully",
    data: transaction,
  });
});

module.exports = {
  getActiveElections,
  getVoterInfo,
  submitVote,
};
