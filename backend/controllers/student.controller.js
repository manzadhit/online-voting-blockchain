const studentService = require("../services/student.service");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");

const getAllStudents = catchAsync(async (req, res) => {
  const students = await studentService.getAllStudents();
  res.status(httpStatus.OK).json({
    status: "success",
    data: students,
  });
});

const getStudentById = catchAsync(async (req, res) => {
  const studentId = parseInt(req.params.studentId, 10);
  const student = await studentService.getStudentById(studentId);

  res.status(httpStatus.OK).json({
    status: "success",
    data: student,
  });
});

const getStudentByNIM = catchAsync(async (req, res) => {
  const { nim } = req.params;
  const student = await studentService.getStudentByNIM(nim);

  res.status(httpStatus.OK).json({
    status: "success",
    data: student,
  });
});

const createStudent = catchAsync(async (req, res) => {
  const { nim, name, faculty, password } = req.body;
  const newStudent = await studentService.createStudent(
    nim,
    name,
    faculty,
    password
  );

  res.status(httpStatus.CREATED).json({
    status: "success",
    message: "Student created successfully",
    data: newStudent,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { nim } = req.params;
  const updatedData = req.body;

  const updatedStudent = await studentService.updateStudent(nim, updatedData);

  res.status(httpStatus.OK).json({
    status: "success",
    message: "Student updated successfully",
    data: updatedStudent,
  });
});

const updateStudentById = catchAsync(async (req, res) => {
  const studentId = parseInt(req.params.studentId, 10);
  const updatedData = req.body;

  const updatedStudent = await studentService.updateStudentById(
    studentId,
    updatedData
  );

  res.status(httpStatus.OK).json({
    status: "success",
    message: "Student updated successfully",
    data: updatedStudent,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { nim } = req.params;
  await studentService.deleteStudent(nim);

  res.status(httpStatus.OK).json({
    status: "success",
    message: "Student deleted successfully",
  });
});

const deleteStudentById = catchAsync(async (req, res) => {
  const studentId = parseInt(req.params.studentId, 10);
  await studentService.deleteStudentById(studentId);

  res.status(httpStatus.OK).json({
    status: "success",
    message: "Student deleted successfully",
  });
});

const login = catchAsync(async (req, res) => {
  const { nim, password } = req.body;

  const student = await studentService.loginStudent(nim, password);

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Login berhasil",
    data: student,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { nim, oldPassword, newPassword } = req.body;

  if (!nim || !oldPassword || !newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "NIM, password lama, dan password baru diperlukan."
    );
  }

  await studentService.resetPassword(nim, oldPassword, newPassword);

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Password berhasil direset.",
  });
});

const addWalletAddress = catchAsync(async (req, res) => {
  const { nim, walletAddress, password } = req.body;

  const student = await studentService.addWalletAddress(nim, walletAddress, password);
  
  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message:
      "Alamat dompet berhasil disimpan di database dan didaftarkan di blockchain.",
    data: student,
  });
});

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentByNIM,
  createStudent,
  updateStudent,
  updateStudentById,
  deleteStudent,
  deleteStudentById,
  login,
  resetPassword,
  addWalletAddress,
};
