import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ClassRecords() {
    const [classDatas, setClassData] = useState([])
    const [filteredClass, setFilteredClass] = useState([])


    async function getClassData() {
        axios.get("http://localhost:3000/faculty/facultyclasses", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then((response) => {
            const classData = response.data.data;
            const sortedClasses = classData.sort((a, b) => {
                const timeA = new Date(b.time);
                const timeB = new Date(a.time);
                return timeA - timeB;
            });
            setClassData(sortedClasses)
            setFilteredClass(sortedClasses)
        })
    }

    useEffect(() => {
        getClassData()
    }, [])

    const clearFilter = () => {
        setFilteredClass(classDatas)
    }

    const sortByDate = (date) => {
        const compDate = new Date(date).toLocaleDateString()
        const filteredClassData = classDatas.filter((cls) => {
            const withCompDate = new Date(cls.time).toLocaleDateString()
            return String(compDate) === String(withCompDate)
        })
        setFilteredClass(filteredClassData)
    }

    const facultyData = {
        name: localStorage.getItem('name'),
        department: localStorage.getItem('department'),
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Faculty Information Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{facultyData.name}</h2>
                            <p className="text-gray-600">{facultyData.department} </p>
                        </div>
                    </div>
                </div>

                {/* Class Records Section */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Class Records</h3>
                            <div className="flex space-x-4">
                                <input
                                    type="date"
                                    onChange={(e) => sortByDate(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={clearFilter}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    Clear Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredClass.map((cls, index) => (
                                    <tr key={index} className="hover:bg-gray-50">

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cls.department} Engineering</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cls.subjectName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(cls.time).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                to={`/class-attendance/${cls.id}`}
                                                target="_blank"
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                            >
                                                View Attendance
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredClass.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No class records found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}