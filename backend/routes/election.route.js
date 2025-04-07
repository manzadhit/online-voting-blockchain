const express = require("express");
const electionController  = require("../controllers/election.controller");

const router = express.Router();

router
  .route("/")
  .post(electionController.createElection)
  .get(electionController.getElections);

router.get("/active", electionController.getActiveElections);

router
  .route("/:electionId")
  .get(electionController.getElection)
  .put(electionController.updateElection)
  .delete(electionController.deleteElection);

module.exports = router;
