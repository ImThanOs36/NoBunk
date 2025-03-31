import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;
const StudentProfile = () => {
    // 1. State Management
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Getting URL Parameters
    const { enrNumber } = useParams();

    // 3. useEffect for Data Fetching
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/student/${enrNumber}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem('token')
                    }
                });
                setStudent(response.data.data);
            } catch (err) {
                setError('Failed to fetch student data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [enrNumber]);

    // 4. Loading State
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 5. Error State
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // 6. Main Render
    return (
        <div className="container mx-auto px-4 py-8">
            {/* 7. Conditional Rendering */}
            {student && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Student Basic Info */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Name</p>
                                <p className="font-semibold">{student.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Roll Number</p>
                                <p className="font-semibold">{student.rollNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Enrollment Number</p>
                                <p className="font-semibold">{student.enrNumber}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Department</p>
                                <p className="font-semibold">{student.department}</p>
                            </div>
                        </div>
                    </div>

                  

                    {/* Recent Attendance */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Attendance</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {student.attendance.slice(0, 5).map((record, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{record.subject}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === "Present"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfile; 