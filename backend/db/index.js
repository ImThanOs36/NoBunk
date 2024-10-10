const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/noBunk"j)
    .then(() => console.log("DB connected successfully"))
    .catch((err) => console.error("DB connection error:", err));

// Define the Student schema
const StudentsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    enrNumber: { type: Number, required: true },
    rollNo: { type: String, required: true },
    dept: { type: String, required: true },
    year: { type: String, required: true }

});
const student = mongoose.model("student", StudentsSchema);
const attendanceSchema = new mongoose.Schema({
    student: [{ type: mongoose.Schema.Types.ObjectId, ref: 'student' }]

})
const attendance = mongoose.model("attendace",attendanceSchema)
module.exports = {student,attendance};

