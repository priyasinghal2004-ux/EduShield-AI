const express = require("express");

const router = express.Router();

const {
  createHelpRequest,
  getHelpRequests,
  resolveHelpRequest,
} = require("../controllers/helpRequest.controller");

router.post("/", createHelpRequest);

router.get("/", getHelpRequests);
router.patch("/:id", resolveHelpRequest);

module.exports = router;