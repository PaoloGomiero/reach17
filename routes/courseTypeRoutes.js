const express = require("express");
const router = express.Router();

const courseTypeController = require("../controllers/courseTypeController");

// Get all course types
router.get("/", courseTypeController.getAllCourseTypes);

// Create a course type
router.post("/", courseTypeController.createCourseType);

// Update a course type
router.put("/:id", courseTypeController.updateCourseType);

// Delete a course type
router.delete("/:id", courseTypeController.deleteCourseType);

module.exports = router;