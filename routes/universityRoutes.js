const express = require("express");
const router = express.Router();

const universityController = require("../controllers/universityController");

// Get all universities
router.get("/", universityController.getAllUniversities);

// Create a university
router.post("/", universityController.createUniversity);

// Update a university
router.put("/:id", universityController.updateUniversity);

// Delete a university
router.delete("/:id", universityController.deleteUniversity);

module.exports = router;