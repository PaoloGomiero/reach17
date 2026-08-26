const express = require("express");
const connection = require("./db/connections");

const app = express();

app.use(express.json());

const PORT = 3000;

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Reach17 API"
  });
});

// =====================================================
// COURSES
// =====================================================

// Get all courses with universities
// Optional filters: name and type
app.get("/courses", (req, res) => {
  const { name, type } = req.query;

  let query = `
    SELECT
      courses.id,
      courses.name AS course_name,
      course_types.name AS course_type,
      GROUP_CONCAT(
        universities.name
        SEPARATOR ', '
      ) AS universities
    FROM courses

    JOIN course_types
      ON courses.course_type_id = course_types.id

    LEFT JOIN course_universities
      ON courses.id = course_universities.course_id

    LEFT JOIN universities
      ON universities.id = course_universities.university_id
  `;

  const conditions = [];
  const values = [];

  if (name) {
    conditions.push("courses.name LIKE ?");
    values.push(`%${name}%`);
  }

  if (type) {
    conditions.push("course_types.name LIKE ?");
    values.push(`%${type}%`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += `
    GROUP BY
      courses.id,
      courses.name,
      course_types.name
  `;

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    res.status(200).json(results);
  });
});

// Create a course
app.post("/courses", (req, res) => {
  const { name, course_type_id } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "Course name is required"
    });
  }

  if (!course_type_id) {
    return res.status(400).json({
      error: "Course type is required"
    });
  }

  // Check if course type exists
  const checkQuery = `
    SELECT id
    FROM course_types
    WHERE id = ?
  `;

  connection.query(
    checkQuery,
    [course_type_id],
    (error, results) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          error: "Database error"
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          error: "Course type not found"
        });
      }

      // Insert course
      const insertQuery = `
        INSERT INTO courses (name, course_type_id)
        VALUES (?, ?)
      `;

      connection.query(
        insertQuery,
        [name, course_type_id],
        (error, results) => {
          if (error) {
            console.error(error);

            return res.status(500).json({
              error: "Database error"
            });
          }

          res.status(201).json({
            id: results.insertId,
            name: name,
            course_type_id: Number(course_type_id)
          });
        }
      );
    }
  );
});

// Update a course
app.put("/courses/:id", (req, res) => {
  const { id } = req.params;
  const { name, course_type_id } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "Course name is required"
    });
  }

  if (!course_type_id) {
    return res.status(400).json({
      error: "Course type is required"
    });
  }

  // Check if course type exists
  const checkQuery = `
    SELECT id
    FROM course_types
    WHERE id = ?
  `;

  connection.query(
    checkQuery,
    [course_type_id],
    (error, results) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          error: "Database error"
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          error: "Course type not found"
        });
      }

      const updateQuery = `
        UPDATE courses
        SET name = ?, course_type_id = ?
        WHERE id = ?
      `;

      connection.query(
        updateQuery,
        [name, course_type_id, id],
        (error, results) => {
          if (error) {
            console.error(error);

            return res.status(500).json({
              error: "Database error"
            });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({
              error: "Course not found"
            });
          }

          res.status(200).json({
            id: Number(id),
            name: name,
            course_type_id: Number(course_type_id)
          });
        }
      );
    }
  );
});

// Delete a course
app.delete("/courses/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM courses
    WHERE id = ?
  `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    res.status(204).send();
  });
});

// =====================================================
// COURSE TYPES
// =====================================================

// Get all course types
app.get("/course-types", (req, res) => {
  const query = `
    SELECT *
    FROM course_types
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    res.status(200).json(results);
  });
});

// Create a course type
app.post("/course-types", (req, res) => {
  const { name } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  const query = `
    INSERT INTO course_types (name)
    VALUES (?)
  `;

  connection.query(query, [name], (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    res.status(201).json({
      id: results.insertId,
      name: name
    });
  });
});

// Update a course type
app.put("/course-types/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  const query = `
    UPDATE course_types
    SET name = ?
    WHERE id = ?
  `;

  connection.query(query, [name, id], (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: "Course type not found"
      });
    }

    res.status(200).json({
      id: Number(id),
      name: name
    });
  });
});

// Delete a course type
app.delete("/course-types/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM course_types
    WHERE id = ?
  `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: "Course type not found"
      });
    }

    res.status(204).send();
  });
});

// =====================================================
// UNIVERSITIES
// =====================================================

// Get all universities
app.get("/universities", (req, res) => {
  const query = `
    SELECT *
    FROM universities
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    res.status(200).json(results);
  });
});

// Create a university
app.post("/universities", (req, res) => {
  const { name } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "University name is required"
    });
  }

  const query = `
    INSERT INTO universities (name)
    VALUES (?)
  `;

  connection.query(query, [name], (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    res.status(201).json({
      id: results.insertId,
      name: name
    });
  });
});

// Update a university
app.put("/universities/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validation
  if (!name || name.trim() === "") {
    return res.status(400).json({
      error: "University name is required"
    });
  }

  const query = `
    UPDATE universities
    SET name = ?
    WHERE id = ?
  `;

  connection.query(query, [name, id], (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: "University not found"
      });
    }

    res.status(200).json({
      id: Number(id),
      name: name
    });
  });
});

// Delete a university
app.delete("/universities/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM universities
    WHERE id = ?
  `;

  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: "University not found"
      });
    }

    res.status(204).send();
  });
});

// =====================================================
// COURSE - UNIVERSITY ASSOCIATION
// =====================================================

// Associate a course with a university
app.post(
  "/courses/:courseId/universities/:universityId",
  (req, res) => {
    const { courseId, universityId } = req.params;

    // Check if course exists
    const checkCourseQuery = `
      SELECT id
      FROM courses
      WHERE id = ?
    `;

    connection.query(
      checkCourseQuery,
      [courseId],
      (error, courseResults) => {
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
              (error, results) => {
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

                res.status(201).json({
                  course_id: Number(courseId),
                  university_id: Number(universityId)
                });
              }
            );
          }
        );
      }
    );
  }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(
    `Reach17 API running on http://localhost:${PORT}`
  );
});