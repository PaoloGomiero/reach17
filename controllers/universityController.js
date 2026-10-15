const connection = require("../db/connections");

// Get all universities
const getAllUniversities = (req, res) => {
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

    return res.status(200).json(results);
  });
};

// Create a university
const createUniversity = (req, res) => {
  const { name } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "University name is required"
    });
  }

  const query = `
    INSERT INTO universities (name)
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

// Update a university
const updateUniversity = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "University name is required"
    });
  }

  const query = `
    UPDATE universities
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
        error: "University not found"
      });
    }

    return res.status(200).json({
      id: Number(id),
      name: name.trim()
    });
  });
};

// Delete a university
const deleteUniversity = (req, res) => {
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

    return res.status(204).send();
  });
};

module.exports = {
  getAllUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity
};