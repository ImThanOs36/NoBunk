const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());





const facultyRoutes = require("./routes/facultyRoute")
const studentRoutes = require("./routes/studentRoute")
app.use(facultyRoutes);
app.use(studentRoutes);


app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");  
});
