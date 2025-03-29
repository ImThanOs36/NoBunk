const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errorHandler");
const twilio = require('twilio');

const router = Router();
const prisma = new PrismaClient();





router.post("/login", async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            throw new AppError("Please provide enrollment number", 400);
        }

        const student = await prisma.student.findUnique({
            where: { enrNumber: String(username) },
            select: {
                id: true,
                enrNumber: true,
                name: true
            }
        });

        if (!student) {
            throw new AppError("Invalid enrollment number", 401);
        }

        const token = jwt.sign(
            { id: student.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'success',
            student,
            token

        });
    } catch (error) {
        next(error);
    }
});

router.get("/:enrNumber", authMiddleware, async (req, res, next) => {
    try {
        const { enrNumber } = req.params;

        if (!enrNumber) {
            throw new AppError("Enrollment number is required", 400);
        }

        const lectures = await prisma.attendance.findMany({
            where: { studentId: enrNumber },
            select: {
                id: true,
                status: true,
                studentId: true,
                date: true,
                subject: true,
                type: true,
            }
        });

        const totalLectures = lectures.length;
        const presentLectures = lectures.filter(lecture => lecture.status === "Present").length;
        const absentLectures = lectures.filter(lecture => lecture.status === "Absent").length;
        const average = totalLectures > 0 ? ((presentLectures / totalLectures) * 100) : 0;

        const studentData = await prisma.student.findUnique({
            where: { enrNumber },
            select: {
                name: true,
                rollNumber: true,
                enrNumber: true,
                department: true,
                year: true,
                attendance: true,
            }
        });

        if (!studentData) {
            throw new AppError("Student not found", 404);
        }

        const finalData = {
            ...studentData,
            totalLectures,
            presentLectures,
            absentLectures,
            presenty: average
        };

        res.status(200).json({
            status: 'success',
            data: finalData
        });
    } catch (error) {
        next(error);
    }
});



// const client = require('twilio')(accountSid, authToken);
router.post("/sendSMS", async (req, res, next) => {
    try {
        const { phoneNumber, message } = req.body;

        if (!phoneNumber || !message) {
            throw new AppError("Phone number and message are required", 400);
        }

        const result = await client.messages.create({
            body: message,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            to: phoneNumber
        });

        res.status(200).json({
            status: 'success',
            data: {
                messageId: result.sid
            }
        });
    } catch (error) {
        next(error);
    }
});




router.get("/data", (req, res) => {



    const name = "Pratik";


    res.json(name)


})






module.exports = router

