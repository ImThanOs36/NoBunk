import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ClassAttendances() {
    const [attendanceData, setattendancesData] = useState({
        Attendance: [{ student: { name: "" } }]
    });
    const params = useParams('classId');

    async function getAttendances() {
        axios.get(`http://localhost:30ltycl00/facuass/${params.classId}`).then((response) => {

            const data = response.data;
            const att = data.Attendance;
            const SortedAttendance = att.sort((a, b) => {
                return Number(a.student.rollNumber) - Number(b.student.rollNumber)
            })
            setattendancesData(data)
        })

    }

    useEffect(() => {
        getAttendances()

    }, [])



    return <div>
        <Navbar />

        <div className=" flex flex-col gap-2 p-4 text-2xl capitalize">
            <div className="border-2 border-black rounded-lg p-4">

                <p>{attendanceData.subject}</p>
                <p>{attendanceData.facultyname}</p>
                <p>{new Date(attendanceData.time).toLocaleDateString()}</p>
            </div>
            <div className="border-2 border-black rounded-lg p-4">
                <table className=" w-full table-fixed ">

                    <thead className="">
                        <tr>
                            <th className=" border-r-2 p-2 w-20 border-2 border-black border-r-white bg-black text-white">Roll No</th>
                            <th className=" border-r-2 border-2 border-black border-r-white bg-black text-white">Name</th>
                            <th className=" border-r-2 border-2 border-black border-r-white bg-black text-white">Status</th>
                        </tr>
                    </thead>
                    <tbody>




                        {attendanceData.Attendance.map((elem, index) => {
                            return <tr key={index} className="border-2 border-black">
                                <td className="border-2 border-r-2 border-black text-center w-20">{elem.student.rollNumber}</td>
                                <td className="border-2 border-r-2 border-black px-10">{elem.student.name}</td>
                                <td className={`text-center ${elem.status === "Absent" ? "text-red-600" : "text-green-500"}`}>{elem.status}</td>
                            </tr>
                        })

                        }
                    </tbody>

                </table>

            </div>
        </div>
    </div>

}