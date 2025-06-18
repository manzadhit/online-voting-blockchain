const express = require("express");
const votingController = require("../controllers/voting.controller");

const router = express.Router();

router.get("/elections/active", votingController.getActiveElections);
router.get("/voters/:voterId", votingController.getVoterInfo);

module.exports = router;
