const bcrypt = require("bcrypt");
const prisma  = require("../prisma/client");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Membuat user baru
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  // Cek apakah username sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { username: userBody.username },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Username sudah digunakan");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userBody.password, salt);

  // Buat user baru
  const user = await prisma.user.create({
    data: {
      username: userBody.username,
      password: hashedPassword,
      name: userBody.name,
    },
  });

  return user;
};

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUser = async (username, password) => {
  // Mencari user berdasarkan username
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User tidak ditemukan");
  }

  // Membandingkan password yang dimasukkan dengan yang tersimpan
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password yang dimasukkan salah"
    );
  }

  return user;
};

/**
 * Mendapatkan semua user
 * @returns {Promise<User[]>}
 */
const getUsers = async () => {
  return prisma.user.findMany();
};

/**
 * Mendapatkan user berdasarkan id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }});

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User tidak ditemukan");
  }

  return user;
};

/**
 * Update user berdasarkan id
 * @param {string} id
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUser = async (id, updateBody) => {
  // Cek apakah user ada
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User tidak ditemukan");
  }

  // Cek jika mengubah username, pastikan username baru tidak digunakan
  if (updateBody.username && updateBody.username !== user.username) {
    const existingUser = await prisma.user.findUnique({
      where: { username: updateBody.username },
    });

    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Username sudah digunakan");
    }
  }

  // Jika ada update password, hash password baru
  if (updateBody.password) {
    const salt = await bcrypt.genSalt(10);
    updateBody.password = await bcrypt.hash(updateBody.password, salt);
  }

  // Update user
  return prisma.user.update({
    where: { id },
    data: updateBody
  });
};

/**
 * Menghapus user berdasarkan id
 * @param {string} id
 * @returns {Promise<User>}
 */
const deleteUser = async (id) => {
  // Cek apakah user ada
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User tidak ditemukan");
  }

  // Hapus user
  return prisma.user.delete({
    where: { id },
  });
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
