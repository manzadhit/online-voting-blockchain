const httpStatus = require("http-status");
const votingService = require("../services/voting.service");
const authService = require("../services/student.service");
const catchAsync = require("../utils/catchAsync");

const getActiveElections = catchAsync(async (req, res) => {
  const elections = await votingService.getActiveElections();
  const allVoter = (await authService.getAllStudents()).length;

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Active elections retrieved successfully",
    data: {
      elections,
      allVoter,
    },
  });
});

const getVoterInfo = catchAsync(async (req, res) => {
  const voterId = parseInt(req.params.voterId, 10);
  if (isNaN(voterId)) {
    return res.status(httpStatus.BAD_REQUEST).send({
      status: httpStatus.BAD_REQUEST,
      message: "Invalid voterId",
    });
  }

  const voter = await votingService.getVoterInfo(voterId);
  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Voter information retrieved successfully",
    data: voter,
  });
});

const submitVote = catchAsync(async (req, res) => {
  const voterId = parseInt(req.body.voterId, 10);
  const candidateId = parseInt(req.body.candidateId, 10);
  const electionId = parseInt(req.body.electionId, 10);

  if ([voterId, candidateId, electionId].some(Number.isNaN)) {
    return res.status(httpStatus.BAD_REQUEST).send({
      status: httpStatus.BAD_REQUEST,
      message:
        "Invalid input: voterId, candidateId, and electionId must be integers",
    });
  }

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

const getResult = catchAsync(async (req, res) => {
  const electionId = parseInt(req.params.electionId, 10);
  if (isNaN(electionId)) {
    return res.status(httpStatus.BAD_REQUEST).send({
      status: httpStatus.BAD_REQUEST,
      message: "Invalid electionId",
    });
  }

  const result = await votingService.getResult(electionId);
  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Election Result retrieved successfully",
    data: result,
  });
});

module.exports = {
  getActiveElections,
  getVoterInfo,
  submitVote,
  getResult,
};
