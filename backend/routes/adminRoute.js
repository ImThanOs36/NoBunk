const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");
const router = Router();
const { AppError } = require("../utils/errorHandler");
const authMiddleware = require("../middleware/authMiddleware");
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const multer = require('multer')
const upload = multer()
const bcrypt = require("bcrypt");


const prisma = new PrismaClient();

router.post("/student/create", async (req, res) => {
    const { name, enrNumber, rollNumber, department, year } = req.body
    try {
        const newStudent = await prisma.student.create({
            data: {
                name: name,
                enrNumber: enrNumber,
                rollNumber: rollNumber,
                department: department,
                year: year
            }
        })
        res.json(newStudent)

    } catch (error) {
        console.log(error)
    }


})



router.post("/faculty/create", async (req, res, next) => {
    try {
        const { name, email, password, department } = req.body;

        if (!name || !email || !password || !department) {
            throw new AppError("Name, email, password, department and role are required", 400);
        }


        const existingFaculty = await prisma.faculty.findUnique({
            where: { email }
        });

        if (existingFaculty) {
            throw new AppError("Faculty with this email already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const faculty = await prisma.faculty.create({
            data: {
                name,
                email,
                password: hashedPassword,
                department,
            },
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                role: true,

            }
        });

        res.status(201).json({
            status: 'success',
            data: faculty
        });
    } catch (error) {
        next(error);
    }
});

router.post("/subject/create", async (req, res, next) => {
    try {
        const { name, code, department, semester, year, type } = req.body;
        const subject = await prisma.subject.create({
            data: {
                name,
                code: Number(code),
                department: department,
                semester: Number(semester),
                year,
                type
            }
        })
        res.status(201).json({
            status: 'success',
            data: subject
        })
    } catch (error) {
        next(error);
    }
})
router.post("/subject/assign", async (req, res, next) => {
    try {
        const { subjectCode, facultyId } = req.body;
        const subject = await prisma.subject.update({
            where: {
                code: Number(subjectCode)
            },
            data: {
                facultyId: Number(facultyId)
            }
        })
        res.status(200).json({
            status: 'success',
            data: subject
        })


    } catch (error) {
        next(error);
    }
})


router.post("/student/addbulk", upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            throw new AppError("No file uploaded", 400);
        }

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const toJson = XLSX.utils.sheet_to_json(worksheet);

        // Validate and format data
        const studentData = toJson.map((student) => ({
            ...student,
            enrNumber: String(student.enrNumber),
        }));

        const students = await prisma.student.createMany({
            data: studentData,
            skipDuplicates: true,
        });

        res.status(201).json({
            status: 'success',
            data: students
        });
    } catch (error) {
        next(error);
    }
});






router.post("/subjects/add", async (req, res, next) => {
    try {
        const { name, code, department, semester, year } = req.body;

        if (!name || !code || !department || !semester || !year) {
            throw new AppError("Subject name, code, department, semester and year are required", 400);
        }

        const subject = await prisma.subject.create({
            data: {
                name,
                code,
                department,
                semester: Number(semester),
                year
            }
        });

        res.status(201).json({
            status: 'success',
            data: subject
        });
    } catch (error) {
        next(error);
    }
});

router.put("/subjects/edit", async (req, res, next) => {
    try {
        const { id, name, code, department, semester, year } = req.body;

        if (!id || !name || !code || !department || !semester || !year) {
            throw new AppError("Subject ID, name, code, department, semester and year are required", 400);
        }

        const subject = await prisma.subject.update({
            where: { id: Number(id) },
            data: {
                name,
                code,
                department,
                semester: Number(semester),
                year
            }
        });

        res.status(200).json({
            status: 'success',
            data: subject
        });
    } catch (error) {
        next(error);
    }
});

// Analytics Routes
router.get("/attendance", async (req, res, next) => {
    try {
        const { department, year } = req.query;

        if (!department || !year) {
            throw new AppError("Department and year are required", 400);
        }


        // Get all students for the selected department and year
        const students = await prisma.student.findMany({
            where: {
                department: department,
                year: year,
            },
            select: {
                id: true,
                name: true,
                rollNumber: true,
                enrNumber: true
            }

        });

        // Get attendance data for each student
        const attendanceData = await Promise.all(students.map(async (student) => {

            const attendance = await prisma.attendance.groupBy({
                by: ['status'],
                where: {
                    studentId: String(student.enrNumber)
                },
                _count: true
            });
            console.log(attendance)

            const totalClasses = attendance.reduce((sum, curr) => sum + curr._count, 0);
            const presentCount = attendance.find(a => a.status === 'Present')?._count || 0;
            const absentCount = attendance.find(a => a.status === 'Absent')?._count || 0;
            const attendancePercentage = totalClasses > 0
                ? Math.round((presentCount / totalClasses) * 100)
                : 0;

            return {
                rollNumber: student.rollNumber,
                name: student.name,
                totalClasses: totalClasses,
                present: presentCount,
                absent: absentCount,
                attendancePercentage
            };
        }));
        res.status(200).json({
            status: 'success',
            data: attendanceData
        });
    } catch (error) {
        next(error);
    }
});

// Subject-wise attendance
router.get("/subject-attendance", async (req, res, next) => {
    try {
        const { department, year, semester, subjectCode } = req.query;

        if (!department || !year || !semester || !subjectCode) {
            throw new AppError("Department, year, semester and subject code are required", 400);
        }

        // First get total number of classes for this subject
        const totalClassesForSubject = await prisma.class.count({
            where: {
                subjectCode: Number(subjectCode),
                year: year
            }
        });

        const students = await prisma.student.findMany({
            where: {
                department: department,
                year: year
            },
            select: {
                id: true,
                name: true,
                rollNumber: true,
                enrNumber: true
            }
        });

        const attendanceData = await Promise.all(students.map(async (student) => {
            const attendance = await prisma.attendance.findMany({
                where: {
                    studentId: String(student.enrNumber),
                    class: {
                        subjectCode: Number(subjectCode)
                    }
                },
            });

            const presentCount = attendance.filter(a => a.status === 'Present').length;
            const absentCount = attendance.filter(a => a.status === 'Absent').length;
            const attendancePercentage = totalClassesForSubject > 0
                ? Math.round((presentCount / totalClassesForSubject) * 100)
                : 0;

            return {
                rollNumber: student.rollNumber,
                name: student.name,
                totalClasses: totalClassesForSubject,
                present: presentCount,
                absent: absentCount,
                attendancePercentage
            };
        }));

        res.status(200).json({
            status: 'success',
            data: attendanceData
        });
    } catch (error) {
        next(error);
    }
});

// Department-wise analytics
router.get("/department-analytics", async (req, res, next) => {
    try {
        const { department, year } = req.query;

        if (!department || !year) {
            throw new AppError("Department and year are required", 400);
        }

        const students = await prisma.student.findMany({
            where: {
                department: department,
                year: year
            },
            select: {
                id: true,
                name: true,
                rollNumber: true,
                enrNumber: true
            }
        });

        if (students.length === 0) {
            return res.status(200).json({
                status: 'success',
                data: {
                    totalStudents: 0,
                    averageAttendance: 0,
                    studentsAbove75: 0,
                    studentsAbove60: 0,
                    studentsBelow60: 0
                }
            });
        }

        const totalStudents = students.length;
        const attendanceData = await Promise.all(students.map(async (student) => {
            const attendance = await prisma.attendance.groupBy({
                by: ['status'],
                where: {
                    studentId: String(student.enrNumber)
                },
                _count: true
            });

            const totalClasses = attendance.reduce((sum, curr) => sum + curr._count, 0);
            const presentCount = attendance.find(a => a.status === 'Present')?._count || 0;

            // Return 0 if no classes attended
            if (totalClasses === 0) return 0;

            return Math.round((presentCount / totalClasses) * 100);
        }));

        const averageAttendance = attendanceData.length > 0
            ? Math.round(attendanceData.reduce((sum, curr) => sum + curr, 0) / totalStudents)
            : 0;

        const studentsAbove75 = attendanceData.filter(percentage => percentage >= 75).length;
        const studentsAbove60 = attendanceData.filter(percentage => percentage >= 60 && percentage < 75).length;
        const studentsBelow60 = attendanceData.filter(percentage => percentage < 60).length;

        res.status(200).json({
            status: 'success',
            data: {
                totalStudents,
                averageAttendance,
                studentsAbove75,
                studentsAbove60,
                studentsBelow60,
                attendanceDistribution: {
                    above75Percent: Math.round((studentsAbove75 / totalStudents) * 100),
                    above60Percent: Math.round((studentsAbove60 / totalStudents) * 100),
                    below60Percent: Math.round((studentsBelow60 / totalStudents) * 100)
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// Export attendance data to Excel
router.get("/export-attendance", async (req, res, next) => {
    try {
        const { department, year } = req.query;

        if (!department || !year) {
            throw new AppError("Department and year are required", 400);
        }

        const students = await prisma.student.findMany({
            where: {
                department: department,
                year: year
            },
            select: {
                id: true,
                name: true,
                rollNumber: true,
                enrNumber: true
            }

        });

        const attendanceData = await Promise.all(students.map(async (student) => {
            const attendance = await prisma.attendance.groupBy({
                by: ['status'],
                where: {
                    studentId: String(student.enrNumber)
                },
                _count: true
            });

            const totalClasses = attendance.reduce((sum, curr) => sum + curr._count, 0);
            const presentCount = attendance.find(a => a.status === 'Present')?._count || 0;
            const absentCount = attendance.find(a => a.status === 'Absent')?._count || 0;
            const attendancePercentage = totalClasses > 0
                ? Math.round((presentCount / totalClasses) * 100)
                : 0;

            return {
                'Roll Number': student.rollNumber,
                'Name': student.name,
                'Total Classes': totalClasses,
                'Present': presentCount,
                'Absent': absentCount,
                'Attendance %': attendancePercentage
            };
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(attendanceData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Data');

        const fileName = `attendance_${department}_${year}_${Date.now()}.xlsx`;
        const filePath = path.join(__dirname, '../uploads', fileName);
        XLSX.writeFile(workbook, filePath);

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            }
            // Clean up the file after download
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        });
    } catch (error) {
        next(error);
    }
});

// Add the new export endpoint
router.get("/attendance/export", async (req, res, next) => {
    try {
        // Get all attendance records with related data
        const attendanceRecords = await prisma.attendance.findMany({
            include: {
                student: {
                    select: {
                        name: true,
                        enrNumber: true,
                        rollNumber: true,
                        department: true,
                        year: true
                    }
                },
                subject: {
                    select: {
                        name: true,
                        code: true
                    }
                }
            },
            orderBy: [
                { date: 'desc' },
                { studentId: 'asc' }
            ]
        });

        // Transform data for Excel
        const excelData = attendanceRecords.map(record => ({
            Date: new Date(record.date).toLocaleDateString(),
            'Student Name': record.student.name,
            'Enrollment Number': record.student.enrNumber,
            'Roll Number': record.student.rollNumber,
            Department: record.student.department,
            Year: record.student.year,
            'Subject Name': record.subject.name,
            'Subject Code': record.subject.code,
            Status: record.status,
            'Time Slot': record.timeSlot
        }));

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Add column widths
        const colWidths = [
            { wch: 12 }, // Date
            { wch: 25 }, // Student Name
            { wch: 15 }, // Enrollment Number
            { wch: 12 }, // Roll Number
            { wch: 15 }, // Department
            { wch: 8 },  // Year
            { wch: 25 }, // Subject Name
            { wch: 12 }, // Subject Code
            { wch: 10 }, // Status
            { wch: 12 }  // Time Slot
        ];
        worksheet['!cols'] = colWidths;

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Records');

        // Generate buffer
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.xlsx');
        
        // Send the file
        res.send(excelBuffer);
    } catch (error) {
        console.error('Export error:', error);
        next(error);
    }
});

router.get("/faculty", async (req, res, next) => {
    try {
        const faculty = await prisma.faculty.findMany();
        res.status(200).json({
            status: 'success',
            data: faculty
        })
    } catch (error) {
        next(error);
    }
})


module.exports = router; 