const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getAllStudents = async () => {
    return await prisma.student.findMany();
};

const getStudentByNIM = async (nim) => {
    const student = await prisma.student.findUnique({
      where: { nim },
    });

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    return student;
};

const createStudent = async (nim, name, faculty, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.student.create({
    data: {
      nim,
      name,
      faculty,
      password: hashedPassword,
      votedElections: [], // Inisialisasi array kosong untuk pemilihan yang sudah diikuti
    },
  });
};

const updateStudent = async (nim, updatedData) => {
  // Jika password diupdate, hash password baru

  await getStudentByNIM(nim);

  if (updatedData.password) {
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
  }

  const updatedStudent = await prisma.student.update({
    where: {
      nim,
    },
    data: updatedData,
  });

  return updatedStudent;
};

const deleteStudent = async (nim) => {
  await getStudentByNIM(nim);

  const deletedStudent = await prisma.student.delete({
    where: { nim },
  });
  return deletedStudent;
};

const loginStudent = async (nim, password) => {
  // Mencari mahasiswa berdasarkan nim
  const student = await prisma.student.findUnique({
    where: { nim },
  });
  
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mahasiswa tidak ditemukan.");
  }

  // Membandingkan password yang dimasukkan dengan yang tersimpan
  const isPasswordValid = await bcrypt.compare(password, student.password);

  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password yang dimasukkan salah."
    );
  }

  return student;
};

const resetPassword = async (nim, newPassword) => {
  // Mencari mahasiswa berdasarkan nim
  const student = await prisma.student.findUnique({
    where: { nim },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Mahasiswa tidak ditemukan.");
  }

  // Hash password baru
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password mahasiswa
  const updatedStudent = await prisma.student.update({
    where: { nim },
    data: {
      password: hashedPassword,
    },
  });

  return updatedStudent;
};

module.exports = {
  getAllStudents,
  getStudentByNIM,
  createStudent,
  updateStudent,
  deleteStudent,
  loginStudent,
  resetPassword,
};
