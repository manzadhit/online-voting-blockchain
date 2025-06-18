const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const prisma = require("../prisma/client");

// Ambil pemilu yang aktif
const getActiveElections = async () => {
  const now = new Date();

  const elections = await prisma.election.findMany({
    where: {
      isActive: true,
      endDate: { gt: now },
    },
    include: {
      candidates: true,
    },
    orderBy: {
      endDate: "asc", // Mengurutkan secara ascending (dari terdekat ke terjauh)
    },
  });

  return elections;
};

// Ambil informasi pemilih berdasarkan studentId (voterId)
const getVoterInfo = async (voterId) => {
  const student = await prisma.student.findUnique({
    where: { id: voterId },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Voter not found");
  }

  return student;
};
// Get candidates by election ID
const getCandidatesByElection = async (electionId) => {
  return await prisma.candidate.findMany({
    where: { electionId: electionId }
  });
};


module.exports = {
  getActiveElections,
  getVoterInfo,
  getCandidatesByElection,
};
