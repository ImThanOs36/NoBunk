const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");
const router = Router();
const multer = require('multer')
const upload = multer()
var XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");




const prisma = new PrismaClient()

router.post("/faculty/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const facultyData = await prisma.faculty.findFirst({

            where: {
                email: username,
                password: password
            }, select: {
                id: true,
                name: true,
                role: true,
                department: true
            }

        })

        res.status(200)
        res.json({ message: "login sucessfully", isLoggedIn: true, id: facultyData.id, name: facultyData.name, role: facultyData.role, department: facultyData.department })

    } catch (error) {
        res.status(411)
        res.json({ message: "login failed" })

    }

})
router.post("/class", async (req, res) => {

    const { department, year, subject, faculty, attendanceData, facultyId, type } = req.body
    const localDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const dateToSave = new Date(localDate);
    try {

        const newClass = await prisma.class.create({
            data: {
                department: department,
                year: year,
                subject: subject,
                facultyname: faculty,
                facultyId: facultyId,
                time: dateToSave,
                year: year,
                type: type
            }
        })


        const attendeceDataWithID = attendanceData.map((data) => {
            return {
                ...data,
                classId: newClass.id,
                date: dateToSave,
                subject: newClass.subject,
                type: newClass.type
            }
        })

        const attendanceCol = await prisma.attendance.createMany({
            data: attendeceDataWithID
        })
        const data = { newClass, ...attendanceCol }
        res.status(200)
        res.json({ data })
    } catch (error) {
        console.log(error)
        res.status(411)
        res.json({ message: "error" })
    }


})
router.post("/facultyclass", async (req, res) => {

    const { facultyId } = req.body;
    try {
        const classes = await prisma.class.findMany({
            where: {
                facultyId: facultyId
            }
        })
        res.json(classes)
    } catch (error) {
        console.log(error)
    }

})
router.get("/facultyclass/:classId", async (req, res) => {

    const param = req.params;
    try {
        const classData = await prisma.class.findUnique({
            where: {
                id: Number(param.classId)
            }, select: {
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
        })
        console.log(classData)
        res.json(classData)
    } catch (error) {
        console.log(error)
    }

});


router.post("/allstudents", async (req, res) => {
    const { year, department } = req.body;

    const allstudents = await prisma.student.findMany({
        where: {
            year: {
                equals:year,
                mode:'insensitive'
            },
            department: {
                equals: department,
                mode: 'insensitive'
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
    })
    res.status(200)
    res.json(allstudents)
})

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

router.post("/addbulk", upload.single('file'), async (req, res) => {
    try {

        const file = req.file;

        var workbook = XLSX.read(file.buffer, { type: "buffer" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const toJson = XLSX.utils.sheet_to_json(worksheet);
        const studentData = toJson.map((student) => {
            student.enrNumber = student.enrNumber.toString()
            student.rollNumber = student.rollNumber.toString()
        })
        const students = await prisma.student.createMany({
            data: toJson,

        })

        res.json(students)
    } catch (error) {
        console.log(error)
        res.json(error)
    }

});

router.get("/exportall", async (res) => {
    try {
        // Fetch students' data
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
                console.error("Error while sending file:", err);
                res.status(500).send("Failed to send file.");
            } else {
                fs.unlinkSync(filePath);
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Something went wrong.");
    }
});


router.post("/faculty/create", async (req, res) => {
    try {
        const { name, email, password, department, role } = req.body;

        const faculty = await prisma.faculty.create({
            data: {
                name: name,
                email: email,
                password: password,
                department: department,
                role: role,

            }
        })
        res.json(faculty)
    } catch (error) {
        console.log(error)
    }

})



module.exports = router;