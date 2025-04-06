const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const electionService = require("../services/election.service");

/**
 * Create a new election
 */
const createElection = catchAsync(async (req, res) => {
  const election = await electionService.createElection(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Election berhasil dibuat",
    data: election,
  });
});

/**
 * Get all elections
 */
const getElections = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.isActive) {
    filter.isActive = req.query.isActive === "true";
  }

  const elections = await electionService.getElections(filter);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Elections berhasil diambil",
    data: elections,
  });
});

/**
 * Get active elections
 */
const getActiveElections = catchAsync(async (req, res) => {
  const elections = await electionService.getActiveElections();

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Active elections berhasil diambil",
    data: elections,
  });
});

/**
 * Get election by id
 */
const getElection = catchAsync(async (req, res) => {
  const election = await electionService.getElectionById(req.params.electionId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Election berhasil diambil",
    data: election,
  });
});

/**
 * Update election
 */
const updateElection = catchAsync(async (req, res) => {
  const election = await electionService.updateElectionById(
    req.params.electionId,
    req.body
  );

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Election berhasil diupdate",
    data: election,
  });
});

/**
 * Delete election
 */
const deleteElection = catchAsync(async (req, res) => {
  await electionService.deleteElectionById(req.params.electionId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Election berhasil dihapus",
  });
});

module.exports = {
  createElection,
  getElections,
  getActiveElections,
  getElection,
  updateElection,
  deleteElection,
};
