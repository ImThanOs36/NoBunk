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
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")


const prisma = new PrismaClient();

router.post("/student/create", async (req, res) => {
    const { name, enrNumber, rollNumber, department, year } = req.body
    try {
        const newStudent = await prisma.student.create({
            data: {
                name,
                enrNumber,
                rollNumber: Number(rollNumber),
                department,
                year
            }
        })
        res.json(newStudent)
    } catch (error) {
        res.status(500).json({ error: error.message })
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

router.post("/subjects/add", async (req, res, next) => {
    try {
        const { name, code, department, semester, year,type } = req.body;

        if (!name || !code || !department || !semester || !year) {
            throw new AppError("Subject name, code, department, semester and year are required", 400);
        }

        const subject = await prisma.subject.create({
            data: {
                name,
                code: Number(code),
                department,
                semester: Number(semester),
                year,
                type
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

router.get("/subjects", async (req, res, next) => {
    const subjects = await prisma.subject.findMany({
        select: {
            id: true,
            name: true,
            code: true,
            department: true,
            semester: true,
            year: true,
            type: true,
            faculty: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
    res.status(200).json({
        status: 'success',
        data: subjects
    })
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



router.put("/subjects/edit", async (req, res, next) => {
    try {
        const { name, code, department, semester, year } = req.body;

        if (!name || !code || !department || !semester || !year) {
            throw new AppError("Subject ID, name, code, department, semester and year are required", 400);
        }

        const subject = await prisma.subject.update({
            where: { code: Number(code) },
            data: {
                name,
                code: Number(code),
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
router.delete("/subjects/:subjectCode", async (req, res, next) => {
    try {
        const { subjectCode } = req.params;
        console.log(subjectCode)

        // First check if the subject exists
        const existingSubject = await prisma.subject.findUnique({
            where: { code: parseInt(subjectCode) }
        });

        if (!existingSubject) {
            throw new AppError("Subject not found", 404);
        }

        // If subject exists, proceed with deletion
        await prisma.subject.delete({
            where: { code: parseInt(subjectCode) }
        });

        res.status(200).json({
            status: 'success',
            message: 'Subject deleted successfully'
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
            orderBy: {
                rollNumber: 'asc'
            },
            select: {
                id: true,
                name: true,
                rollNumber: true,
                enrNumber: true
            }
        });

        // Get all subjects for the department and year
        const subjects = await prisma.subject.findMany({
            where: {
                department: {
                    has: department
                },
                year: year
            },
            select: {
                code: true,
                name: true,
                type: true
            }
        });

        // Get attendance data for each student
        const attendanceData = await Promise.all(students.map(async (student) => {
            // Get overall attendance
            const attendance = await prisma.attendance.groupBy({
                by: ['status', 'type'],
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

            // Get subject-wise attendance
            const subjectAttendance = await Promise.all(subjects.map(async (subject) => {
                const subjectAttendance = await prisma.attendance.groupBy({
                    by: ['status', 'type'],
                    where: {
                        studentId: String(student.enrNumber),
                        subject: subject.name
                    },
                    _count: true
                });

                const subjectTotalClasses = subjectAttendance.reduce((sum, curr) => sum + curr._count, 0);
                const subjectPresentCount = subjectAttendance.find(a => a.status === 'Present')?._count || 0;

                // Calculate lecture and practical attendance separately
                const lectureAttendance = subjectAttendance.filter(a => a.type === 'LECTURE');
                const practicalAttendance = subjectAttendance.filter(a => a.type === 'PRACTICAL');

                const lectureTotal = lectureAttendance.reduce((sum, curr) => sum + curr._count, 0);
                const lecturePresent = lectureAttendance.find(a => a.status === 'Present')?._count || 0;
                const practicalTotal = practicalAttendance.reduce((sum, curr) => sum + curr._count, 0);
                const practicalPresent = practicalAttendance.find(a => a.status === 'Present')?._count || 0;

                return {
                    subjectCode: subject.code,
                    subjectName: subject.name,
                    totalClasses: subjectTotalClasses,
                    present: subjectPresentCount,
                    absent: subjectTotalClasses - subjectPresentCount,
                    lecture: {
                        total: lectureTotal,
                        present: lecturePresent,
                        absent: lectureTotal - lecturePresent,
                        percentage: lectureTotal > 0 ? Math.round((lecturePresent / lectureTotal) * 100) : 0
                    },
                    practical: {
                        total: practicalTotal,
                        present: practicalPresent,
                        absent: practicalTotal - practicalPresent,
                        percentage: practicalTotal > 0 ? Math.round((practicalPresent / practicalTotal) * 100) : 0
                    }
                };
            }));

            return {
                rollNumber: student.rollNumber,
                name: student.name,
                totalClasses,
                present: presentCount,
                absent: absentCount,
                attendancePercentage,
                subjectAttendance
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
router.get("/export-attendance", async (req, res) => {
    try {
        const { department, year } = req.query;

        if (!department || !year) {
            return res.status(400).json({
                status: 'error',
                message: 'Department and year are required'
            });
        }

        // Get all students in the department and year
        const students = await prisma.student.findMany({
            where: {
                department,
                year
            },
            orderBy: {
                rollNumber: 'asc'
            },
            select: {
                id: true,
                name: true,
                rollNumber: true,
                enrNumber: true,
                department: true,
                year: true,
                attendance: {
                    select: {
                        date: true,
                        subject: true,
                        status: true,
                        type: true
                    }
                }
            }
        });

        // Get all subjects for the department and year
        const subjects = await prisma.subject.findMany({
            where: {
                department: {
                    has: department
                },
                year: year
            },
            select: {
                code: true,
                name: true
            }
        });

        // Prepare data for Excel
        const workbook = XLSX.utils.book_new();

        // Create attendance summary sheet
        const summaryData = students.map(student => {
            const totalClasses = student.attendance.length;
            const presentClasses = student.attendance.filter(a => a.status === "Present").length;
            const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

            return {
                'Roll Number': student.rollNumber,
                'Name': student.name,
                'Total Classes': totalClasses,
                'Present': presentClasses,
                'Absent': totalClasses - presentClasses,
                'Overall Attendance %': attendancePercentage
            };
        });

        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Overall Attendance');

        // Create subject-wise attendance sheet
        const subjectWiseData = students.flatMap(student => {
            const subjectAttendance = subjects.map(subject => {
                const subjectRecords = student.attendance.filter(a => a.subject === subject.name);
                const totalClasses = subjectRecords.length;
                const presentClasses = subjectRecords.filter(a => a.status === "Present").length;
                const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

                return {
                    'Roll Number': student.rollNumber,
                    'Name': student.name,
                    'Subject': subject.name,
                    'Total Classes': totalClasses,
                    'Present': presentClasses,
                    'Absent': totalClasses - presentClasses,
                    'Attendance %': attendancePercentage
                };
            });
            return subjectAttendance;
        });

        const subjectWiseSheet = XLSX.utils.json_to_sheet(subjectWiseData);
        XLSX.utils.book_append_sheet(workbook, subjectWiseSheet, 'Subject-wise Attendance');

        // Create detailed attendance sheet
        const detailedData = students.flatMap(student =>
            student.attendance.map(record => ({
                'Roll Number': student.rollNumber,
                'Name': student.name,
                'Date': new Date(record.date).toLocaleDateString(),
                'Subject': record.subject,
                'Type': record.type,
                'Status': record.status
            }))
        );

        const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed_Attendance');

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });


        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: '"Shubham Lad" <lads42279@gmail.com>',
            to: "ladshubham36@gmail.com",
            subject: "Issue Report",
            text: `Hello,
      
      
      Best regards,
      Shubham Lad
      <lads42279@gmail.com>`,
            attachments: [
                {
                    filename: "Detailed_Attendance.xlsx",
                    content: excelBuffer,
                    encoding: "base64",
                },
            ],
        });



        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=attendance_${department}_${year}.xlsx`);

        // Send the Excel file
        res.send(excelBuffer);





    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
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

// Faculty Management Routes
router.put("/faculty/:facultyId", async (req, res, next) => {
    try {
        const { facultyId } = req.params;
        const { name, email, password, department, role } = req.body;

        // Check if faculty exists
        const existingFaculty = await prisma.faculty.findUnique({
            where: { id: parseInt(facultyId) }
        });

        if (!existingFaculty) {
            throw new AppError("Faculty not found", 404);
        }

        // Prepare update data
        const updateData = {
            name,
            email,
            department,
            role
        };

        // Only update password if provided
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // Update faculty
        const updatedFaculty = await prisma.faculty.update({
            where: { id: parseInt(facultyId) },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                role: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: updatedFaculty
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/faculty/:facultyId", async (req, res, next) => {
    try {
        const { facultyId } = req.params;

        // Check if faculty exists
        const existingFaculty = await prisma.faculty.findUnique({
            where: { id: parseInt(facultyId) }
        });

        if (!existingFaculty) {
            throw new AppError("Faculty not found", 404);
        }

        // Delete faculty
        await prisma.faculty.delete({
            where: { id: parseInt(facultyId) }
        });

        res.status(200).json({
            status: 'success',
            message: 'Faculty deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

// Student Management Routes
router.get("/students", async (req, res, next) => {
    try {
        const students = await prisma.student.findMany({
            orderBy: [
                { department: 'asc' },
                { year: 'asc' },
                { rollNumber: 'asc' }
            ]
        });
        res.status(200).json({
            status: 'success',
            data: students
        });
    } catch (error) {
        next(error);
    }
});

router.put("/student/:studentId", async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const { name, enrNumber, rollNumber, department, year } = req.body;

        // Check if student exists
        const existingStudent = await prisma.student.findUnique({
            where: { id: parseInt(studentId) }
        });

        if (!existingStudent) {
            throw new AppError("Student not found", 404);
        }

        // Update student
        const updatedStudent = await prisma.student.update({
            where: { id: parseInt(studentId) },
            data: {
                name,
                enrNumber,
                rollNumber: parseInt(rollNumber),
                department,
                year
            }
        });

        res.status(200).json({
            status: 'success',
            data: updatedStudent
        });
    } catch (error) {
        next(error);
    }
});

router.delete("/student/:studentId", async (req, res, next) => {
    try {
        const { studentId } = req.params;

        // Check if student exists
        const studentToDelete = await prisma.student.findUnique({
            where: { id: parseInt(studentId) }
        });

        if (!studentToDelete) {
            throw new AppError("Student not found", 404);
        }

        // Get all students in the same department and year with higher roll numbers
        const studentsToUpdate = await prisma.student.findMany({
            where: {
                department: studentToDelete.department,
                year: studentToDelete.year,
                rollNumber: {
                    gt: studentToDelete.rollNumber
                }
            },
            orderBy: {
                rollNumber: 'asc'
            }
        });

        // Delete the student
        await prisma.student.delete({
            where: { id: parseInt(studentId) }
        });

        // Update roll numbers for remaining students
        for (let i = 0; i < studentsToUpdate.length; i++) {
            await prisma.student.update({
                where: { id: studentsToUpdate[i].id },
                data: {
                    rollNumber: studentToDelete.rollNumber + i
                }
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Student deleted successfully and roll numbers updated'
        });
    } catch (error) {
        next(error);
    }
});

// Admin Login Route (Public)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Find admin by email
        const admin = await prisma.admin.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true
            }
        });

        if (!admin) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return admin data without password
        const adminData = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };

        res.status(200).json({
            status: 'success',
            data: {
                token,
                admin: adminData
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Admin Management Routes
router.get("/admins", async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
        res.json({
            status: 'success',
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching admins'
        });
    }
});

// Create new admin
router.post('/create', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin exists
        const adminExists = await prisma.admin.findUnique({
            where: { email }
        });

        if (adminExists) {
            return res.status(400).json({
                status: 'error',
                message: 'Admin with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const admin = await prisma.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'SUPER_ADMIN'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        res.status(201).json({
            status: 'success',
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error creating admin'
        });
    }
});

// Update admin
router.put('/:adminId', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if admin exists
        const admin = await prisma.admin.findUnique({
            where: { id: parseInt(req.params.adminId) }
        });

        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'Admin not found'
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== admin.email) {
            const emailExists = await prisma.admin.findUnique({
                where: { email }
            });
            if (emailExists) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already in use'
                });
            }
        }

        // Prepare update data
        const updateData = {
            name: name || admin.name,
            email: email || admin.email
        };

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update admin
        const updatedAdmin = await prisma.admin.update({
            where: { id: parseInt(req.params.adminId) },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        res.json({
            status: 'success',
            data: updatedAdmin
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error updating admin'
        });
    }
});

// Delete admin
router.delete('/:adminId', async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: parseInt(req.params.adminId) }
        });

        if (!admin) {
            return res.status(404).json({
                status: 'error',
                message: 'Admin not found'
            });
        }

        // Check if this is the last super admin
        const superAdminCount = await prisma.admin.count({
            where: { role: 'SUPER_ADMIN' }
        });

        if (superAdminCount === 1 && admin.role === 'SUPER_ADMIN') {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete the last super admin'
            });
        }

        await prisma.admin.delete({
            where: { id: parseInt(req.params.adminId) }
        });

        res.json({
            status: 'success',
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error deleting admin'
        });
    }
});

module.exports = router; 