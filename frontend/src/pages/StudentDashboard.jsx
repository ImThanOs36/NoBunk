import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";
import Navbar from "../components/Navbar"

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState({
    name: "name",
    rollNo: "0",
    enrNumber: "2218140000",
    department: "department",
    year: "year",
    attendance: [{ subject: "subject", status: "status", date: "date" }],

  });
  const [filteredData, setFilteredData] = useState([{}])
  const id = useParams("enrNumber");
  const enrNumber = String(id.enrNumber);

  async function getData() {
    try {
      axios.get(`http://localhost:3000/student/${enrNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).then((response) => {
        setStudentData(response.data);
        const attendanceRes = response.data.attendance;
        setFilteredData(attendanceRes)


      })
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleFilter = (date) => {
    const compDate = new Date(date).toLocaleDateString()

    const filteredClassData = studentData.attendance.filter((cls) => {
      const withCompDate = new Date(cls.date).toLocaleDateString()
      return String(compDate) === String(withCompDate)
    })
    setFilteredData(filteredClassData)

  }
  const clearFilter = () => {
    setFilteredData(studentData.attendance)
  }

  console.log(filteredData)
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="w-full font-excon font-medium p-1 capitalize" >
        <span className="text-2xl font-semibold">Student Information :</span>
        <div className="flex justify-between flex-wrap gap-2 ">
          <div className=" w-full">
            <table className="w-full p-8  bg-slate-10 rounded-lg border-2 border-black overflow-x-scroll overflow-y-hidden ">
              <thead>
                <tr className="border-collapse bg-black text-white">
                  <th className="border-2 border-r-white border-black px-4 py-2  rotate-vertical">Name</th>
                  <th className="border-2 border-r-white border-black px-4 py-2  rotate-vertical">Enrollment Number</th>
                  <th className="border-2 border-r-white border-black px-4 py-2  rotate-vertical">Roll Number</th>
                  <th className="border-2 border-r-white border-black px-4 py-2  rotate-vertical">Department</th>
                  <th className="border-2  border-black px-4 py-2  rotate-vertical">Year</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-2 border-black">{studentData.name}</td>
                  <td className="p-3 border-2 border-black">{studentData.enrNumber}</td>
                  <td className="p-3 border-2 border-black">{studentData.rollNumber}</td>
                  <td className="p-3 border-2 border-black">{studentData.department}</td>
                  <td className="p-3 border-2 border-black">{studentData.year}</td>

                </tr>
              </tbody>
            </table>

          </div>
          <div className=" border-2 border-black  flex flex-col gap-2 justify-center font-semibold ">
            <span className="px-5 py-2 w-full bg-black text-white">Attendance </span>
            <div className="p-2">

              <p> Total Class: {studentData.totalLectures}</p>
              <p> Present Class: {studentData.presentLectures}</p>
              <p>Absent Class: {studentData.absentLectures}</p>


              <p>Attendance Percentage:{Math.floor(studentData.presenty)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: + (studentData.presenty) + '%' }}></div>
              </div>

            </div>
          </div>
        </div>
        <div className="p-2 border-2 border-black rounded-xs mt-5 text-lg w-full">
          <input type="date" name="date" id="date" onChange={(e) => {
            handleFilter(e.target.value)
          }} />
          <button onClick={() => {
            clearFilter()
          }}>
            Clear filter
          </button>
          <span className=" px-1 py-2 w-full text-2xl font-bold">Attendance :</span>

          {studentData.attendance.length > 0 ? (
            <table className="w-full border table-fixed">
              <thead>

                <tr className="border-collapse bg-black text-white">
                  <th className="border-2 border-r-white border-black px-4 py-2 w-1/3">Date</th>
                  <th className="border-2 border-r-white border-black px-4 py-2 w-1/3">Subject</th>
                  <th className="border-2 border-r-white border-black px-4 py-2 w-1/3">Lecture/PR</th>
                  <th className="border-2 border-black px-4 py-2 w-1/3">Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredData.sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((lecture, index) => (
                    <tr key={index} className="  rounded-lg w-full border-collapse bg-gray-300 hover:bg-gray-200 ">
                      <td className=" border-2 border-black py-3 px-3">{new Date(lecture.date).toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" })}</td>
                      <td className="border-2 border-black px-3">{lecture.subject}</td>
                      <td className="border-2 border-black px-3">{lecture.type}</td>
                      <td className={`text-center border-2 px-3 border-black ${lecture.status == "Present" ? "text-green-500" : "text-red-600"}`}>{lecture.status}</td>
                    </tr>
                  ))}

              </tbody>
            </table>
          ) : (
            <p>No attendance records available.</p>
          )}
        </div>
      </div>
    </div>

  )

}


