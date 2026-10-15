const express = require("express");
const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Reach17 API"
  });
});

module.exports = router;