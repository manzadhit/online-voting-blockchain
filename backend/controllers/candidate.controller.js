const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const candidateService = require("../services/candidate.service");

/**
 * Create a new candidate
 */
const createCandidate = catchAsync(async (req, res) => {
  // Convert electionId to integer if present
  if (req.body.electionId) {
    req.body.electionId = parseInt(req.body.electionId, 10);
  }

  const candidate = await candidateService.createCandidate(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Candidate berhasil dibuat",
    data: candidate,
  });
});

/**
 * Get all candidates
 */
const getCandidates = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.electionId) {
    filter.electionId = parseInt(req.query.electionId, 10);
  }
  const candidates = await candidateService.getCandidates(filter);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Candidates berhasil diambil",
    data: candidates,
  });
});

/**
 * Get candidates by election id
 */
const getCandidatesByElection = catchAsync(async (req, res) => {
  const electionId = parseInt(req.params.electionId, 10);
  const candidates = await candidateService.getCandidatesByElectionId(
    electionId
  );

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Candidates berhasil diambil",
    data: candidates,
  });
});

/**
 * Get candidate by id
 */
const getCandidate = catchAsync(async (req, res) => {
  const candidateId = parseInt(req.params.candidateId, 10);
  const candidate = await candidateService.getCandidateById(candidateId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Candidate berhasil diambil",
    data: candidate,
  });
});

/**
 * Update candidate
 */
const updateCandidate = catchAsync(async (req, res) => {
  const candidateId = parseInt(req.params.candidateId, 10);

  // Convert electionId to integer if present in body
  if (req.body.electionId) {
    req.body.electionId = parseInt(req.body.electionId, 10);
  }

  const candidate = await candidateService.updateCandidateById(
    candidateId,
    req.body
  );

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Candidate berhasil diupdate",
    data: candidate,
  });
});

/**
 * Delete candidate
 */
const deleteCandidate = catchAsync(async (req, res) => {
  const candidateId = parseInt(req.params.candidateId, 10);
  await candidateService.deleteCandidateById(candidateId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Candidate berhasil dihapus",
  });
});

/**
 * Vote for a candidate
 */
const voteCandidate = catchAsync(async (req, res) => {
  const candidateId = parseInt(req.params.candidateId, 10);
  const candidate = await candidateService.updateVoteCount(candidateId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Vote berhasil ditambahkan",
    data: candidate,
  });
});

module.exports = {
  createCandidate,
  getCandidates,
  getCandidatesByElection,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  voteCandidate,
};
