const connection = require("../db/connections");

// Associate a course with a university
const associateCourseWithUniversity = (req, res) => {
  const { courseId, universityId } = req.params;

  // Check if course exists
  const checkCourseQuery = `
    SELECT id
    FROM courses
    WHERE id = ?
  `;

  connection.query(checkCourseQuery, [courseId], (error, courseResults) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    if (courseResults.length === 0) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    // Check if university exists
    const checkUniversityQuery = `
      SELECT id
      FROM universities
      WHERE id = ?
    `;

    connection.query(
      checkUniversityQuery,
      [universityId],
      (error, universityResults) => {
        if (error) {
          console.error(error);

          return res.status(500).json({
            error: "Database error"
          });
        }

        if (universityResults.length === 0) {
          return res.status(404).json({
            error: "University not found"
          });
        }

        // Create association
        const insertQuery = `
          INSERT INTO course_universities
            (course_id, university_id)
          VALUES (?, ?)
        `;

        connection.query(
          insertQuery,
          [courseId, universityId],
          (error) => {
            if (error) {
              console.error(error);

              if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                  error:
                    "Course is already associated with this university"
                });
              }

              return res.status(500).json({
                error: "Database error"
              });
            }

            return res.status(201).json({
              course_id: Number(courseId),
              university_id: Number(universityId)
            });
          }
        );
      }
    );
  });
};

module.exports = {
  associateCourseWithUniversity
};