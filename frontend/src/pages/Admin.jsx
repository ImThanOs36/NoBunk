import { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectManagement from './SubjectManagement';
import StudentManagement from './StudentManagement';
import FacultyManagement from './FacultyManagement';
import AdminManagement from './AdminManagement';

const API_URL = import.meta.env.VITE_API_URL;

export default function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [subjects, setSubjects] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [subjectAttendanceData, setSubjectAttendanceData] = useState([]);
    const [departmentAnalytics, setDepartmentAnalytics] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [selectedYear, setSelectedYear] = useState('FIRST');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [loading, setLoading] = useState(false);

    const departments = ['CSE', 'EE', 'MECH', 'CIVIL'];
    const years = ['FIRST', 'SECOND', 'THIRD'];

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchSubjects();
            fetchAttendanceData();
            fetchDepartmentAnalytics();
            if (selectedSubject) {
                fetchSubjectAttendanceData();
            }
        }
    }, [activeTab, selectedDepartment, selectedYear, selectedSubject]);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/subjects`, {
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
        try {
            const response = await axios.get(`${API_URL}/admin/attendance`, {
                params: {
                    department: selectedDepartment,
                    year: selectedYear
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAttendanceData(response.data.data);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        }
    };

    const fetchSubjectAttendanceData = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/subject-attendance`, {
                params: {
                    department: selectedDepartment,
                    year: selectedYear,
                    subjectCode: selectedSubject
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSubjectAttendanceData(response.data.data);
        } catch (error) {
            console.error('Error fetching subject attendance data:', error);
        }
    };

    const fetchDepartmentAnalytics = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/department-analytics`, {
                params: {
                    department: selectedDepartment,
                    year: selectedYear
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setDepartmentAnalytics(response.data.data);
        } catch (error) {
            console.error('Error fetching department analytics:', error);
        }
    };

    const handleExportAttendance = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/export-attendance`, {
                params: {
                    department: selectedDepartment,
                    year: selectedYear
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob'
            });

            const blob = new Blob([response.data], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_${selectedDepartment}_${selectedYear}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting attendance:', error);
            alert('Error exporting attendance data. Please try again.');
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'subjects', label: 'Subject Management' },
        { id: 'students', label: 'Student Management' },
        { id: 'faculty', label: 'Faculty Management' },
        { id: 'admins', label: 'Admin Management' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-ranade">
            {/* Tabs */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Year</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                                    <select
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="">All Subjects</option>
                                        {subjects
                                            .filter(subject => subject.department === selectedDepartment && subject.year === selectedYear)
                                            .map((subject) => (
                                                <option key={subject.code} value={subject.code}>
                                                    {subject.name} ({subject.code})
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleExportAttendance}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Export Attendance
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Department Analytics */}
                        {departmentAnalytics && (
                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Department Analytics</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-blue-800">Total Students</h3>
                                        <p className="mt-2 text-3xl font-semibold text-blue-600">{departmentAnalytics.totalStudents}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-green-800">Average Attendance</h3>
                                        <p className="mt-2 text-3xl font-semibold text-green-600">{departmentAnalytics.averageAttendance}%</p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-yellow-800">Students Above 75%</h3>
                                        <p className="mt-2 text-3xl font-semibold text-yellow-600">{departmentAnalytics.studentsAbove75}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Attendance Tables */}
                        <div className="space-y-6">
                            {/* Overall Attendance */}
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:px-6">
                                    <h2 className="text-lg font-medium text-gray-900">Overall Attendance</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                {subjects
                                                    .filter(subject => subject.department === selectedDepartment && subject.year === selectedYear)
                                                    .map(subject => (
                                                        <th key={subject.code} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            {subject.name}
                                                        </th>
                                                    ))}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall %</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {attendanceData.map((student) => (
                                                <tr key={student.rollNumber}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                                    {subjects
                                                        .filter(subject => subject.department === selectedDepartment && subject.year === selectedYear)
                                                        .map(subject => {
                                                            const subjectAttendance = student.subjectAttendance?.find(
                                                                sa => sa.subjectCode === subject.code
                                                            );
                                                            return (
                                                                <td key={subject.code} className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    <div className="flex flex-col space-y-1">
                                                                        <div className="flex items-center space-x-2">
                                                                            <span className="text-xs text-gray-500">Lecture:</span>
                                                                            <span className={`font-medium ${
                                                                                subjectAttendance?.lecture.percentage >= 75 ? 'text-green-600' :
                                                                                subjectAttendance?.lecture.percentage >= 60 ? 'text-yellow-600' :
                                                                                'text-red-600'
                                                                            }`}>
                                                                                {subjectAttendance?.lecture.percentage || 0}%
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                ({subjectAttendance?.lecture.present || 0}/{subjectAttendance?.lecture.total || 0})
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <span className="text-xs text-gray-500">Practical:</span>
                                                                            <span className={`font-medium ${
                                                                                subjectAttendance?.practical.percentage >= 75 ? 'text-green-600' :
                                                                                subjectAttendance?.practical.percentage >= 60 ? 'text-yellow-600' :
                                                                                'text-red-600'
                                                                            }`}>
                                                                                {subjectAttendance?.practical.percentage || 0}%
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">
                                                                                ({subjectAttendance?.practical.present || 0}/{subjectAttendance?.practical.total || 0})
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.totalClasses}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.present}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.absent}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`font-medium ${
                                                            student.attendancePercentage >= 75 ? 'text-green-600' :
                                                            student.attendancePercentage >= 60 ? 'text-yellow-600' :
                                                            'text-red-600'
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

                            {/* Subject-wise Attendance */}
                            {selectedSubject && (
                                <div className="bg-white shadow rounded-lg overflow-hidden">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h2 className="text-lg font-medium text-gray-900">Subject-wise Attendance</h2>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {subjectAttendanceData.map((student) => (
                                                    <tr key={student.rollNumber}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.rollNumber}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.totalClasses}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.present}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.absent}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`font-medium ${
                                                                student.attendancePercentage >= 75 ? 'text-green-600' :
                                                                student.attendancePercentage >= 60 ? 'text-yellow-600' :
                                                                'text-red-600'
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
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'subjects' && <SubjectManagement />}
                {activeTab === 'students' && <StudentManagement />}
                {activeTab === 'faculty' && <FacultyManagement />}
                {activeTab === 'admins' && <AdminManagement />}
            </div>
        </div>
    );
}

