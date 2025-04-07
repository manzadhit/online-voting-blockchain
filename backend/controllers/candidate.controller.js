const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const candidateService  = require("../services/candidate.service");

/**
 * Create a new candidate
 */
const createCandidate = catchAsync(async (req, res) => {
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
    filter.electionId = req.query.electionId;
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
  const candidates = await candidateService.getCandidatesByElectionId(
    req.params.electionId
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
  const candidate = await candidateService.getCandidateById(
    req.params.candidateId
  );

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
  const candidate = await candidateService.updateCandidateById(
    req.params.candidateId,
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
  await candidateService.deleteCandidateById(req.params.candidateId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Candidate berhasil dihapus",
  });
});

/**
 * Vote for a candidate
 */
const voteCandidate = catchAsync(async (req, res) => {
  const candidate = await candidateService.updateVoteCount(
    req.params.candidateId
  );

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
