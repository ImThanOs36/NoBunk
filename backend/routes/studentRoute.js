const { PrismaClient } = require("@prisma/client");
const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken")

const router = Router()




const prisma = new PrismaClient()
// router.post("/student", async (req, res) => {
//     const { name, enrNumber, rollNumber, department, year } = req.body
//     try {
//         const newStudent = await prisma.student.create({
//             data: {
//                 name: name,
//                 enrNumber: enrNumber,
//                 rollNumber: rollNumber,
//                 department: department,
//                 year: year
//             }
//         })
//         res.json(newStudent)

//     } catch (error) {
//         console.log(error)
//     }


// })


// localhost:3000/student/login

router.post("/student/login", async (req, res) => {

    const { username } = req.body;

    try {
        const student = await prisma.student.findUnique({
            where: {
                enrNumber: String(username),
            }, select: {
                id: true,
                enrNumber: true,
            }
        })
        console.log(student)
        const token = jwt.sign({ id: student.id }, process.env.JWT_SECRET)
        res.json({ student: student, token: token })
    } catch (error) {
        console.log(error)
        res.json(error)
    }

})
router.get("/student/:enrNumber", authMiddleware, async (req, res) => {
    const { enrNumber } = req.params;
    console.log(req.userId)
    try {
        const lectures = await prisma.attendance.findMany({
            where: {
                studentId: enrNumber
            }, select: {
                id: true,
                status: true,
                studentId: true,
                date: true,
                subject: true,
                type: true,

            }



        })

        const totalLectures = lectures.length;

        const presentLectures = lectures.filter((lecture) => {
            return lecture.status == "Present"
        }).length
        const absentLectures = lectures.filter((lecture) => {
            return lecture.status == "Absent"
        }).length
        const average = ((presentLectures / totalLectures) * 100)
        const lecture = {
            totalLectures: totalLectures,
            presentLectures: presentLectures,
            absentLectures: absentLectures,
            presenty: average,
        }
        console.log(totalLectures, presentLectures, absentLectures)
        const studentData = await prisma.student.findUnique({
            where: {
                enrNumber: enrNumber,
            },
            select: {
                name: true,
                rollNumber: true,
                enrNumber: true,
                department: true,
                year: true,
                attendance: true,


            }
        })

        const finalData = { ...studentData, ...lecture }
        res.cookie("role", "student", {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        res.json(finalData)
    } catch (error) {
        console.log(error)
    }

})






router.get("/data", (req, res) => {



    const name = "Pratik";


    res.json(name)


})






module.exports = router

