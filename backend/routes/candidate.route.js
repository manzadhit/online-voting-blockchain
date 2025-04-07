const express = require("express");
const candidateController = require("../controllers/candidate.controller");

const router = express.Router();

router
  .route("/")
  .post(candidateController.createCandidate)
  .get(candidateController.getCandidates);

router.get(
  "/election/:electionId",
  candidateController.getCandidatesByElection
);

router
  .route("/:candidateId")
  .get(candidateController.getCandidate)
  .put(candidateController.updateCandidate)
  .delete(candidateController.deleteCandidate);

router.post(
  "/:candidateId/vote",
  candidateController.voteCandidate
);

module.exports = router;
