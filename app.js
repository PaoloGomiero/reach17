const express = require("express");

const courseRoutes = require("./routes/courseRoutes");
const courseTypeRoutes = require("./routes/courseTypeRoutes");
const universityRoutes = require("./routes/universityRoutes");
const courseUniversityRoutes = require("./routes/courseUniversityRoutes");
const homeRoutes = require("./routes/homeRoutes");

const app = express();

app.use(express.json());



// API routes
app.use("/courses", courseRoutes);
app.use("/course-types", courseTypeRoutes);
app.use("/universities", universityRoutes);
app.use("/", courseUniversityRoutes);
app.use("/", homeRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Reach17 API running on http://localhost:${PORT}`);
});