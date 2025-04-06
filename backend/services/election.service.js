const httpStatus = require("http-status");
const prisma  = require("../prisma/client");
const ApiError = require("../utils/ApiError");

/**
 * Create a new election
 * @param {Object} electionBody
 * @returns {Promise<Object>}
 */
const createElection = async (electionBody) => {
  return prisma.election.create({
    data: electionBody,
  });
};

/**
 * Get all elections
 * @param {Object} filter - Optional filter
 * @returns {Promise<Array>}
 */
const getElections = async (filter = {}) => {
  return prisma.election.findMany({
    where: filter,
    include: {
      candidates: true,
    },
  });
};

/**
 * Get election by id
 * @param {String} id
 * @returns {Promise<Object>}
 */
const getElectionById = async (id) => {
  const election = await prisma.election.findUnique({
    where: { id },
    include: {
      candidates: true,
    },
  });

  if (!election) {
    throw new ApiError(httpStatus.NOT_FOUND, "Election tidak ditemukan");
  }

  return election;
};

/**
 * Update election by id
 * @param {String} id
 * @param {Object} updateBody
 * @returns {Promise<Object>}
 */
const updateElectionById = async (id, updateBody) => {
  const election = await getElectionById(id);

  return prisma.election.update({
    where: { id },
    data: updateBody,
  });
};

/**
 * Delete election by id
 * @param {String} id
 * @returns {Promise<Object>}
 */
const deleteElectionById = async (id) => {
  const election = await getElectionById(id);

  return prisma.election.delete({
    where: { id },
  });
};

/**
 * Get active elections
 * @returns {Promise<Array>}
 */
const getActiveElections = async () => {
  const currentDate = new Date();

  return prisma.election.findMany({
    where: {
      isActive: true,
      startDate: {
        lte: currentDate,
      },
      endDate: {
        gte: currentDate,
      },
    },
    include: {
      candidates: true,
    },
  });
};

module.exports = {
  createElection,
  getElections,
  getElectionById,
  updateElectionById,
  deleteElectionById,
  getActiveElections,
};
