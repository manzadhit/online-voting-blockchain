const express = require("express");
const authRoutes = require("./auth.route");
const blockRoutes = require("./blockchain.route");
const voteRoutes = require("./vote.route");

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
];


Routes.forEach((route) => {
  router.use(route.path, route.route);
});


module.exports = router;
