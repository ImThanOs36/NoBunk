const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());  // Middleware to parse JSON body

const { student, attendance } = require("./db/index");  // Import the student 

// POST route to add a new student
app.post("/student", async (req, res) => {
    try {
        const std = new student({
            name: req.body.username || "ThanOs",
            enrNumber: 2218140078,
            rollNo: "18",
            dept: "CSE",
            year: "TY"

        })
        await std.save();
        const att = new attendance({
            student: std._id,

        })
        await att.save() // Save student to the database

        // Create student with request body or default
        res.json({ student: std, attendance: att });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET route to check if the server is running
app.get("/", async (req, res) => {
    const user = await attendance.findOne()
    const userId = user.student
    const username = await student.findById(userId)
    console.log(userId)
    
    res.json({ student: student, name:username.name });
});

// Start the server
app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");  // Fixed the protocol
});
