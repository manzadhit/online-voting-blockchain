const httpStatus = require("http-status");
const userService = require("../services/user.service");
const catchAsync = require("../utils/catchAsync");

/**
 * Register user baru
 */
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  // Menghilangkan password dari response
  const { password, ...userWithoutPassword } = user;

  return res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "User berhasil didaftarkan",
    data: userWithoutPassword,
  });
});

/**
 * Login user
 */
const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;

  const user = await userService.loginUser(username, password);

  // Menghilangkan password dari response
  const { password: userPassword, ...userWithoutPassword } = user;

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Login berhasil",
    data: userWithoutPassword,
  });
});

/**
 * Mendapatkan semua users
 */
const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers();

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Berhasil mendapatkan semua users",
    data: users,
  });
});

/**
 * Mendapatkan user berdasarkan id
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Berhasil mendapatkan user",
    data: user,
  });
});

/**
 * Update user
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "User berhasil diupdate",
    data: user,
  });
});

/**
 * Delete user
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id);

  return res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "User berhasil dihapus",
    data: null,
  });
});

module.exports = {
  register,
  login,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
