const express = require("express");

const router = express.Router();

const {
  createHelpRequest,
  getHelpRequests,
} = require("../controllers/helpRequest.controller");

router.post("/", createHelpRequest);

router.get("/", getHelpRequests);

module.exports = router;