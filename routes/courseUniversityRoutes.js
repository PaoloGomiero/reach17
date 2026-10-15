const express = require("express");
const router = express.Router();

const courseUniversityController = require("../controllers/courseUniversityController");

// Associate a course with a university
router.post(
  "/courses/:courseId/universities/:universityId",
  courseUniversityController.associateCourseWithUniversity
);

module.exports = router;