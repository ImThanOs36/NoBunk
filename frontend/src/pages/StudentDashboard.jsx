import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios";

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

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{studentData.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{studentData.enrNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{studentData.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{studentData.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{studentData.year}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Classes</span>
                  <span className="font-semibold">{studentData.totalLectures}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Present Classes</span>
                  <span className="font-semibold text-green-600">{studentData.presentLectures}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Absent Classes</span>
                  <span className="font-semibold text-red-600">{studentData.absentLectures}</span>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Attendance Percentage</span>
                    <span className="font-semibold">{Math.floor(studentData.presenty)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${studentData.presenty}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
            <div className="flex gap-4">
              <input
                type="date"
                onChange={(e) => handleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={clearFilter}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Clear Filter
              </button>
            </div>
          </div>

          {studentData.attendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lecture/PR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((lecture, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(lecture.date).toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lecture.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lecture.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            lecture.status === "Present" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {lecture.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No attendance records available.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


