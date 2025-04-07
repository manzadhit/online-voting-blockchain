const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
