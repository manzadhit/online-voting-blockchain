const express = require("express");
const authRoutes = require("./auth.route");
const blockRoutes = require("./blockchain.route");
const voteRoutes = require("./vote.route");
const electionRoute = require("./election.route");
const candidateRoute = require("./candidate.route");

const router = express.Router();

const Routes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/blocks",
    route: blockRoutes,
  },
  {
    path: "/voting",
    route: voteRoutes,
  },
  {
    path: "/elections",
    route: electionRoute,
  },
  {
    path: "/candidates",
    route: candidateRoute,
  },
];


Routes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
