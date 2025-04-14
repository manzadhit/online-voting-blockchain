const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.get("/", authController.getAllStudents);
router.get("/:nim", authController.getStudentByNIM);
router.post("/", authController.createStudent);
router.put("/:nim", authController.updateStudent);
router.delete("/:nim", authController.deleteStudent);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
