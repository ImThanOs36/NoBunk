import axios from 'axios';
import { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL;



export default function CreateClass() {
  const [studentData, setStudentData] = useState([]);
  const [attendancesData, setattendancesData] = useState([]);
  const [classData, setClassData] = useState()
  const [type, setType] = useState('lecture')
  const [subjectCode, setSubjectCode] = useState(0)
  const [subjects, setSubjects] = useState(["SUBJECT 1"])
  const [classType, setClassType] = useState()


  async function getSubjects() {
    const response = await axios.get(`${API_URL}/faculty/subjects`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log("API Response:", response.data);
    setSubjects(response.data.data)
    console.log(subjects)
  }

  async function getData() {
    if (subjectCode === '' || type === '') {
      alert("Please select all fields")
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/faculty/allstudents`, { subjectCode }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("API Response:", response.data);

      // Access the students array from response.data.data
      const students = response.data.data || [];
      console.log("Processed students:", students);

      const sortedData = students.sort((a, b) => {
        return Number(a.rollNumber) - Number(b.rollNumber);
      });
      console.log("Sorted data:", sortedData);

      setStudentData(sortedData);
      setClassData({
        type: type,

      });
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Error fetching student data. Please try again.");
    }
  }

  // Add useEffect to monitor state changes
  useEffect(() => {
    getSubjects()
    console.log("Current studentData:", studentData);
  }, [studentData]);

  const handleAttendanceChange = (studentId) => {
    const studentExists = attendancesData.some((item) => item.studentId === studentId);
    if (studentExists) {
      setattendancesData(
        attendancesData.map((item) =>
          item.studentId === studentId
            ? { ...item, status: item.status === "Present" ? "Absent" : "Present" }
            : item
        )
      );
    } else {
      setattendancesData([...attendancesData, { studentId, status: "Present" }]);
    }
  };

  const handleSubjectChange = (code) => {
    setSubjectCode(code);
    const selectedSubject = subjects.find(s => s.code === parseInt(code));
    setClassType(selectedSubject ? selectedSubject.type : []);

  };

  async function submitData() {
    const allStudentIds = studentData.map((student) => student.enrNumber);
    const absentData = allStudentIds
      .filter((enrNumber) => !attendancesData.some((item) => item.studentId === enrNumber))
      .map((studentId) => ({ studentId, status: "Absent" }));

    const attendanceData = [...attendancesData, ...absentData];
    const finalData = { ...classData, attendanceData, subjectCode };

    function resetStates() {
      setClassData(null);
      setattendancesData([]);
      setStudentData([]);
      setSubjectCode(0)
    }

    try {
      const response = await axios.post(`${API_URL}/faculty/class`, { finalData }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log("Class data submitted:", response.data);
      resetStates();
      alert("Class data submitted successfully!");
    } catch (error) {
      console.error("Error submitting class data:", error);
      alert("Failed to submit class data. Please try again.");
    }
  }
  console.log(type)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Setup Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Class</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="subject"
                    value={subjectCode}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                  >
                    <option value={null}>Select a subject</option>
                    {
                      subjects.map((subject, index) => (
                        <option key={index} value={subject.code}>{subject.name}</option>
                      ))
                    }


                  </select>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a type</option>
                    {classType && classType.length > 0 ? classType.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    )) : <option value="">No types available</option>}
                  </select>

                </div>

                <button
                  onClick={getData}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Create Class
                </button>
              </div>
            </div>
          </div>

          Class Information Card
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Class Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {/* <span className="text-gray-700">Faculty: <span className="font-semibold">{faculty.name}</span></span> */}
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {/* <span className="text-gray-700">Year: <span className="font-semibold">{year}</span></span> */}
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {/* <span className="text-gray-700">Subject: <span className="font-semibold">{subject}</span></span> */}
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">Date: <span className="font-semibold">{new Date().toLocaleDateString()}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Student List */}
        {studentData && studentData.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Student List</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Present: {attendancesData.filter(a => a.status === "Present").length}
                  </span>
                  <span className="text-sm text-gray-500">
                    Absent: {studentData.length - attendancesData.filter(a => a.status === "Present").length}
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentData.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            checked={attendancesData.some(a => a.studentId === student.enrNumber && a.status === "Present")}
                            onChange={() => handleAttendanceChange(student.enrNumber)}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {attendancesData.some(a => a.studentId === student.enrNumber && a.status === "Present") ? "Present" : "Absent"}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={submitData}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Submit Attendance
              </button>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

