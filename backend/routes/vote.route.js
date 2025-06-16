// routes/votingRoutes.js
const express = require("express");
const votingController = require("../controllers/voting.controller");

const router = express.Router();

router.get("/elections/active", votingController.getActiveElections);
router.get("/voters/:voterId", votingController.getVoterInfo);
// router.get("/result/:electionId", votingController.getResult);
router.post("/vote", votingController.submitVote);

module.exports = router;
