const connection = require("../db/connections");

// Get all course types
const getAllCourseTypes = (req, res) => {
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

    return res.status(200).json(results);
  });
};

// Create a course type
const createCourseType = (req, res) => {
  const { name } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  const query = `
    INSERT INTO course_types (name)
    VALUES (?)
  `;

  connection.query(query, [name.trim()], (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        error: "Database error"
      });
    }

    return res.status(201).json({
      id: results.insertId,
      name: name.trim()
    });
  });
};

// Update a course type
const updateCourseType = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Name is required"
    });
  }

  const query = `
    UPDATE course_types
    SET name = ?
    WHERE id = ?
  `;

  connection.query(query, [name.trim(), id], (error, results) => {
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

    return res.status(200).json({
      id: Number(id),
      name: name.trim()
    });
  });
};

// Delete a course type
const deleteCourseType = (req, res) => {
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

    return res.status(204).send();
  });
};

module.exports = {
  getAllCourseTypes,
  createCourseType,
  updateCourseType,
  deleteCourseType
};