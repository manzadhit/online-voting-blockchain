const express = require("express");
const studentConttoller = require("../controllers/student.controller");
const router = express.Router();

router.get("/", studentConttoller.getAllStudents);
router.get("/:nim", studentConttoller.getStudentByNIM);
router.post("/", studentConttoller.createStudent);
router.put("/:nim", studentConttoller.updateStudent);
router.delete("/:nim", studentConttoller.deleteStudent);
router.post("/login", studentConttoller.login);
router.post("/reset-password", studentConttoller.resetPassword);

module.exports = router;
