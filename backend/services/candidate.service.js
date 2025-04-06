const httpStatus = require("http-status");
const prisma = require("../prisma/client");
const ApiError = require("../utils/ApiError");

/**
 * Create a new candidate
 * @param {Object} candidateBody
 * @returns {Promise<Object>}
 */
const createCandidate = async (candidateBody) => {
  // Verifikasi apakah election ada
  const election = await prisma.election.findUnique({
    where: { id: candidateBody.electionId },
  });

  if (!election) {
    throw new ApiError(httpStatus.NOT_FOUND, "Election tidak ditemukan");
  }

  return prisma.candidate.create({
    data: candidateBody,
  });
};

/**
 * Get all candidates
 * @param {Object} filter - Optional filter
 * @returns {Promise<Array>}
 */
const getCandidates = async (filter = {}) => {
  return prisma.candidate.findMany({
    where: filter,
    include: {
      election: true,
    },
  });
};

/**
 * Get candidates by election id
 * @param {String} electionId
 * @returns {Promise<Array>}
 */
const getCandidatesByElectionId = async (electionId) => {
  return prisma.candidate.findMany({
    where: { electionId },
  });
};

/**
 * Get candidate by id
 * @param {String} id
 * @returns {Promise<Object>}
 */
const getCandidateById = async (id) => {
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      election: true,
    },
  });

  if (!candidate) {
    throw new ApiError(httpStatus.NOT_FOUND, "Candidate tidak ditemukan");
  }

  return candidate;
};

/**
 * Update candidate by id
 * @param {String} id
 * @param {Object} updateBody
 * @returns {Promise<Object>}
 */
const updateCandidateById = async (id, updateBody) => {
  const candidate = await getCandidateById(id);

  // Jika ada perubahan electionId, verifikasi election baru
  if (updateBody.electionId && updateBody.electionId !== candidate.electionId) {
    const election = await prisma.election.findUnique({
      where: { id: updateBody.electionId },
    });

    if (!election) {
      throw new ApiError(httpStatus.NOT_FOUND, "Election tidak ditemukan");
    }
  }

  return prisma.candidate.update({
    where: { id },
    data: updateBody,
  });
};

/**
 * Delete candidate by id
 * @param {String} id
 * @returns {Promise<Object>}
 */
const deleteCandidateById = async (id) => {
  const candidate = await getCandidateById(id);

  return prisma.candidate.delete({
    where: { id },
  });
};

/**
 * Update vote count for a candidate
 * @param {String} id
 * @returns {Promise<Object>}
 */
const updateVoteCount = async (id) => {
  const candidate = await getCandidateById(id);

  return prisma.candidate.update({
    where: { id },
    data: {
      voteCount: { increment: 1 },
    },
  });
};

module.exports = {
  createCandidate,
  getCandidates,
  getCandidatesByElectionId,
  getCandidateById,
  updateCandidateById,
  deleteCandidateById,
  updateVoteCount,
};
