const connection = require("../db/connections");

// Get all courses with universities
// Optional filters: name and type
const getAllCourses = (req, res) => {
  const { name, type } = req.query;

  let query = `
    SELECT
      courses.id,
      courses.name AS course_name,
      course_types.name AS course_type,
      GROUP_CONCAT(universities.name SEPARATOR ', ') AS universities
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

    return res.status(200).json(results);
  });
};

// Create a course
const createCourse = (req, res) => {
  const { name, course_type_id } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Course name is required"
    });
  }

  if (
    course_type_id === undefined ||
    course_type_id === null ||
    course_type_id === ""
  ) {
    return res.status(400).json({
      error: "Course type is required"
    });
  }

  const checkQuery = `
    SELECT id
    FROM course_types
    WHERE id = ?
  `;

  connection.query(checkQuery, [course_type_id], (error, results) => {
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

    const insertQuery = `
      INSERT INTO courses (name, course_type_id)
      VALUES (?, ?)
    `;

    connection.query(
      insertQuery,
      [name.trim(), course_type_id],
      (error, results) => {
        if (error) {
          console.error(error);

          return res.status(500).json({
            error: "Database error"
          });
        }

        return res.status(201).json({
          id: results.insertId,
          name: name.trim(),
          course_type_id: Number(course_type_id)
        });
      }
    );
  });
};

// Update a course
const updateCourse = (req, res) => {
  const { id } = req.params;
  const { name, course_type_id } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Course name is required"
    });
  }

  if (
    course_type_id === undefined ||
    course_type_id === null ||
    course_type_id === ""
  ) {
    return res.status(400).json({
      error: "Course type is required"
    });
  }

  const checkQuery = `
    SELECT id
    FROM course_types
    WHERE id = ?
  `;

  connection.query(checkQuery, [course_type_id], (error, results) => {
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
      [name.trim(), course_type_id, id],
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

        return res.status(200).json({
          id: Number(id),
          name: name.trim(),
          course_type_id: Number(course_type_id)
        });
      }
    );
  });
};

// Delete a course
const deleteCourse = (req, res) => {
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

    return res.status(204).send();
  });
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
};