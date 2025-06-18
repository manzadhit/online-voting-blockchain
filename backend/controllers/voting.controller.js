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

module.exports = {
  getActiveElections,
  getVoterInfo,
};
