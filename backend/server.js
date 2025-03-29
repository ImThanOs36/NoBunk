const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/student", require("./routes/studentRoute"));
app.use("/faculty", require("./routes/facultyRoute"));
app.use("/admin", require("./routes/adminRoute"));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
