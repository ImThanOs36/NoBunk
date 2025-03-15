import { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectManagement from './SubjectManagement';
import CreateFaculty from './CreateFaculty';

export default function Admin() {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [departmentAnalytics, setDepartmentAnalytics] = useState(null);
    // const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('overall'); // 'overall', 'subject', 'analytics'
    const departments = ['CSE', 'EE', 'MECH', 'CIVIL'];
    const years = ['FIRST', 'SECOND', 'THIRD'];
    const semesters = [1, 2, 3, 4, 5, 6];
    const subjects = ['Operating System'];
    const [activeTab, setActiveTab] = useState('attendance'); // 'attendance', 'subjects', 'faculty'

    useEffect(() => {
        if (selectedDepartment && selectedYear && selectedSemester) {
            fetchSubjects();
        }
    }, [selectedDepartment, selectedYear, selectedSemester]);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/admin/subjects`, {
                params: {
                    department: selectedDepartment,
                    year: selectedYear,
                    semester: selectedSemester,
                    subject: selectedSubject
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSubjects(response.data.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchAttendanceData = async () => {
        if (!selectedDepartment || !selectedYear) {
            alert('Please select both department and year');
            return;
        }

        setLoading(true);
        try {
            let response;
            if (viewMode === 'subject' && selectedSubject) {
                response = await axios.get(`http://localhost:3000/admin/subject-attendance`, {
                    params: {
                        department: selectedDepartment,
                        year: selectedYear,
                        semester: selectedSemester,
                        subjectCode: selectedSubject
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            } else if (viewMode === 'analytics') {
                response = await axios.get(`http://localhost:3000/admin/department-analytics`, {
                    params: {
                        department: selectedDepartment,
                        year: selectedYear
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDepartmentAnalytics(response.data.data);
                return;
            } else {
                response = await axios.get(`http://localhost:3000/admin/attendance`, {
                    params: {
                        department: selectedDepartment,
                        year: selectedYear
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            }
            setAttendanceData(response.data.data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            alert('Error fetching attendance data');
        }
        setLoading(false);
    };

    const exportToExcel = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/admin/export-attendance`, {
                params: {
                    department: selectedDepartment,
                    year: selectedYear
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_${selectedDepartment}_${selectedYear}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error exporting attendance data');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-8">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('attendance')}
                            className={`px-4 py-2 rounded-md ${activeTab === 'attendance'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Attendance Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('subjects')}
                            className={`px-4 py-2 rounded-md ${activeTab === 'subjects'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Subject Management
                        </button>
                        <button
                            onClick={() => setActiveTab('faculty')}
                            className={`px-4 py-2 rounded-md ${activeTab === 'faculty'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Faculty Management
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {activeTab === 'attendance' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Filters */}
                        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>{dept} Engineering</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Year</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                {viewMode === 'subject' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                            <select
                                                value={selectedSemester}
                                                onChange={(e) => setSelectedSemester(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Semester</option>
                                                {semesters.map((sem) => (
                                                    <option key={sem} value={sem}>Semester {sem}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                            <select
                                                value={selectedSubject}
                                                onChange={(e) => setSelectedSubject(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Subject</option>
                                                {subjects.map((subject, index) => (
                                                    <option key={index} value={22004}>{subject}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="mt-4 flex gap-4">
                                <div className="flex-1">
                                    <select
                                        value={viewMode}
                                        onChange={(e) => setViewMode(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="overall">Overall Attendance</option>
                                        <option value="subject">Subject-wise Attendance</option>
                                        <option value="analytics">Department Analytics</option>
                                    </select>
                                </div>
                                <button
                                    onClick={fetchAttendanceData}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    View Data
                                </button>
                                <button
                                    onClick={exportToExcel}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Export to Excel
                                </button>
                            </div>
                        </div>

                        {/* Department Analytics */}
                        {viewMode === 'analytics' && departmentAnalytics && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-xl font-semibold mb-4">Department Analytics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-blue-800">Total Students</h3>
                                        <p className="text-2xl font-bold text-blue-600">{departmentAnalytics.totalStudents}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-green-800">Average Attendance</h3>
                                        <p className="text-2xl font-bold text-green-600">{departmentAnalytics.averageAttendance}%</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-green-800">Above 75%</h3>
                                        <p className="text-2xl font-bold text-green-600">{departmentAnalytics.studentsAbove75}</p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-yellow-800">60-75%</h3>
                                        <p className="text-2xl font-bold text-yellow-600">{departmentAnalytics.studentsAbove60}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-red-800">Below 60%</h3>
                                        <p className="text-2xl font-bold text-red-600">{departmentAnalytics.studentsBelow60}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Attendance Table */}
                        {loading ? (
                            <div className="text-center py-8">Loading...</div>
                        ) : attendanceData.length > 0 ? (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {attendanceData.map((student, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.totalClasses}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{student.present}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{student.absent}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.attendancePercentage >= 75
                                                            ? 'bg-green-100 text-green-800'
                                                            : student.attendancePercentage >= 60
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {student.attendancePercentage}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Select department and year to view attendance analytics
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'subjects' && (
                    <SubjectManagement />
                )}

                {activeTab === 'faculty' && (
                    <CreateFaculty />
                )}
            </div>
        </div>
    );
}

