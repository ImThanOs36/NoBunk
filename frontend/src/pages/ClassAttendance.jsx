import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ClassAttendances() {
    const [attendanceData, setattendancesData] = useState({
        Attendance: [{ student: { name: "" } }]
    });
    const [subjectName, setSubjectName] = useState("")
    const [facultyName, setFacultyName] = useState("")
    const params = useParams('classId');
    console.log(params)

    async function getAttendances() {
        axios.get(`http://localhost:3000/faculty/facultyclass/${params.id}`).then((response) => {
            const data = response.data.data;

            const att = data.Attendance;
            const SortedAttendance = att.sort((a, b) => {
                return Number(a.student.rollNumber) - Number(b.student.rollNumber)
            })

            setSubjectName(data.subject.name)
            setattendancesData(data)
        })
    }

    useEffect(() => {
        getAttendances()

    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Class Information Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{subjectName}</h2>
                            <p className="text-gray-600">Faculty: {facultyName}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="flex items-center space-x-2 text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{new Date(attendanceData.time).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Attendance Records</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {attendanceData.Attendance.map((elem, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{elem.student.rollNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{elem.student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${elem.status === "Present"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}>
                                                {elem.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}