const express = require("express");
const blockchainController = require("../controllers/blockchain.controller");

const router = express.Router();

router.post("/vote", blockchainController.voteOnBlockchain);
router.get(
  "/candidate-votes/:candidateId",
  blockchainController.getCandidateVoteCount
);
router.post(
  "/election-results/:electionId",
  blockchainController.getElectionResults
);
router.get(
  "/voter-status/:voterId/:electionId",
  blockchainController.getVoterStatus
);
router.get(
  "/election-votes/:electionId",
  blockchainController.getElectionVotes
);
router.get("/all-votes", blockchainController.getAllVotes);
router.get("/transaction/:txHash", blockchainController.getTransactionDetails);

module.exports = router;
