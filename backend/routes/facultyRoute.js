const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");
const router = Router();
const multer = require('multer')
const upload = multer()
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../middleware/passwordMiddleware");
const { AppError } = require("../utils/errorHandler");
const authMiddleware = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient()

router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new AppError("Please provide email and password", 400);
        }

        const facultyData = await prisma.faculty.findFirst({
            where: { email: username },
            select: {
                id: true,
                name: true,
                role: true,
                department: true,
                password: true
            }
        });

        if (!facultyData) {
            throw new AppError("Invalid credentials", 401);
        }

        const isPasswordValid = await comparePassword(password, facultyData.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid credentials", 401);
        }

        const token = jwt.sign(
            { id: facultyData.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'success',
            data: {
                token,
                id: facultyData.id,
                name: facultyData.name,
                role: facultyData.role,
                department: facultyData.department
            }
        });
    } catch (error) {
        next(error);
    }
})

router.post("/class", authMiddleware, async (req, res, next) => {
    const { subjectCode, attendanceData, type } = req.body.finalData;
    const facultyId = req.userId;

    try {

        const localDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const dateToSave = new Date(localDate);

        const faculty = await prisma.faculty.findUnique({
            where: {
                id: facultyId
            }
        });

        const subject = await prisma.subject.findUnique({
            where: {
                code: Number(subjectCode)
            }
        });

        if (!subject) {
            throw new AppError("Subject not found", 404);
        }

        const newClass = await prisma.class.create({
            data: {
                department: faculty.department,
                year: subject.year,
                facultyId: Number(facultyId),
                time: dateToSave,
                type: Array.isArray(type) ? type : [type],
                subjectCode: Number(subjectCode),
                subjectName: subject.name,
            }
        });

        const attendanceDataWithID = attendanceData.map((data) => ({
            studentId: data.studentId,
            classId: newClass.id,
            date: dateToSave,
            subject: newClass.subjectName,
            status: data.status,
            type: String(newClass.type)
        }));

        const attendanceCol = await prisma.attendance.createMany({
            data: attendanceDataWithID
        });

        res.status(201).json({
            status: 'success',
            data: { newClass, attendanceCol }
        });
    } catch (error) {
        next(error);
    }
})
router.get("/subjects",  authMiddleware, async (req, res, next) => {
    const userId = req.userId;
    try {
        const subjects = await prisma.subject.findMany({
            where: {
                facultyId: userId
            }
        });
        res.status(200).json({
            status: 'success',
            data: subjects
        });
    } catch (error) {
        next(error);
    }
})
router.get("/facultyclasses", authMiddleware, async (req, res, next) => {
    try {
        const facultyId = req.userId
        console.log(req.userId)

        if (!facultyId) {
            throw new AppError("Faculty ID is required", 400);
        }

        const classes = await prisma.class.findMany({
            where: { facultyId }
        });

        res.status(200).json({
            status: 'success',
            data: classes
        });
    } catch (error) {
        next(error);
    }
})

router.get("/facultyclass/:classId", async (req, res, next) => {
    try {
        const { classId } = req.params;

        if (!classId) {
            throw new AppError("Class ID is required", 400);
        }

        const classData = await prisma.class.findUnique({
            where: { id: Number(classId) },
            select: {
                subject: true,
                time: true,
                Attendance: {
                    select: {
                        student: {
                            select: {
                                name: true,
                                rollNumber: true,
                            }
                        },
                        status: true,
                    }
                }
            }
        });

        if (!classData) {
            throw new AppError("Class not found", 404);
        }

        res.status(200).json({
            status: 'success',
            data: classData
        });
    } catch (error) {
        next(error);
    }
});

router.post("/allstudents", async (req, res, next) => {
    try {
        const { subjectCode } = req.body;
        const subjectCodeNumber = Number(subjectCode)
        const info = await prisma.subject.findUnique({
            where: {
                code: subjectCodeNumber
            }
        });
        const { year, department } = info
        console.log(year, department)
        if (!year || !department) {
            throw new AppError("Year and department are required", 400);
        }

        const allstudents = await prisma.student.findMany({
            where: {
                year: year,
                department: {
                    in: department
                }
            },
            select: {
                id: true,
                name: true,
                enrNumber: true,
                rollNumber: true,
                department: true,
                year: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: allstudents
        });
    } catch (error) {
        next(error);
    }
});

router.get("/class", async (req, res) => {

    const classData = await prisma.class.findUnique({
        where: {
            id: 3
        }, select: {
            subject: true,
            faculty: true,
            department: true,
            time: true,
            Attendance: {
                select: {
                    id: true,
                    date: true,
                    status: true,
                    subject: true,

                }

            },

        }
    })
    res.json(classData)


})

router.get("/exportall", async (req, res, next) => {
    try {
        const allstudents = await prisma.student.findMany({
            select: {
                name: true,
                enrNumber: true,
                rollNumber: true,
                department: true,
                year: true,
            },
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(allstudents);
        XLSX.utils.book_append_sheet(workbook, worksheet, "studentsData");

        const filePath = path.join(__dirname, "studentData.xlsx");
        XLSX.writeFile(workbook, filePath);

        res.sendFile(filePath, (err) => {
            if (err) {
                next(new AppError("Failed to send file", 500));
            } else {
                fs.unlinkSync(filePath);
            }
        });
    } catch (error) {
        next(error);
    }
});


router.post("/addmarks", async (req, res) => {

    try {

        const marksData = [{
            subject: "Sub1",
            totalMarks: 10,
            gotMarks: 10,

        }, {
            subject: "Sub2",
            totalMarks: 10,
            gotMarks: 10,

        }]

        const marks = await prisma.marks.create({
            data: {
                studentId: 1,
                type: "semister",
                marks: marksData

            }
        })
        res.json({ marks })

    } catch (error) {
        console.log(error)
    }


})

module.exports = router;