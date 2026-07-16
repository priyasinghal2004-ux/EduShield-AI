const HelpRequest = require("../models/HelpRequest.model");

// Create Help Request
exports.createHelpRequest = async (req, res) => {
  try {
    const request = await HelpRequest.create(req.body);

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Help Requests
exports.getHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Resolve Help Request
exports.resolveHelpRequest = async (req, res) => {
  try {
    const request = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};