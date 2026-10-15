const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");

// Get all courses, with optional filters
router.get("/", courseController.getAllCourses);

// Create a course
router.post("/", courseController.createCourse);

// Update a course
router.put("/:id", courseController.updateCourse);

// Delete a course
router.delete("/:id", courseController.deleteCourse);

module.exports = router;