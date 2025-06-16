const express = require("express");
const studentRoutes = require("./student.route");
const voteRoutes = require("./vote.route");
const electionRoute = require("./election.route");
const candidateRoute = require("./candidate.route");
const userRoute = require("./user.route");

const router = express.Router();

const Routes = [
  {
    path: "/students",
    route: studentRoutes,
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
  {
    path: "/user",
    route: userRoute,
  },
];


Routes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
