import { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

export default function SubjectManagement() {
    const [subjects, setSubjects] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: [],
        semester: '',
        year: '',
        type: []
    });
    const [assignmentData, setAssignmentData] = useState({
        subjectCode: '',
        facultyId: ''
    });

    const departments = ['CSE', 'EE', 'MECH', 'CIVIL'];
    const years = ['FIRST', 'SECOND', 'THIRD'];
    const semesters = [1, 2, 3, 4, 5, 6];
    const types = ['LECTURE', 'PRACTICAL'];

    useEffect(() => {
        fetchFaculty();
        fetchSubjects();
    }, []);

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

    const fetchFaculty = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/faculty`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFaculty(response.data.data);
        } catch (error) {
            console.error('Error fetching faculty:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'type') {
            const newTypes = [...formData.type];
            if (e.target.checked) {
                newTypes.push(value);
            } else {
                const index = newTypes.indexOf(value);
                if (index > -1) {
                    newTypes.splice(index, 1);
                }
            }
            setFormData(prev => ({ ...prev, type: newTypes }));
        } else if (name === 'department') {
            const newDepartments = [...formData.department];
            if (e.target.checked) {
                newDepartments.push(value);
            } else {
                const index = newDepartments.indexOf(value);
                if (index > -1) {
                    newDepartments.splice(index, 1);
                }
            }
            setFormData(prev => ({ ...prev, department: newDepartments }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAssignmentChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAssignFaculty = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/admin/subject/assign`, assignmentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Faculty assigned successfully!');
            setAssignmentData({
                subjectCode: '',
                facultyId: ''
            });
            fetchSubjects();
        } catch (error) {
            console.error('Error assigning faculty:', error);
            alert('Error assigning faculty');
        }
        setLoading(false);
    };

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/admin/subjects/add`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Subject created successfully!');
            setFormData({
                name: '',
                code: '',
                department: [],
                semester: '',
                year: '',
                type: []
            });
            fetchSubjects();
        } catch (error) {
            console.error('Error creating subject:', error);
            alert('Error creating subject');
        }
        setLoading(false);
    };

    const handleEditSubject = (subject) => {
        setEditingSubject(subject);
        setFormData({
            name: subject.name,
            code: subject.code,
            department: subject.department,
            semester: subject.semester,
            year: subject.year,
            type: subject.type
        });
        setShowEditModal(true);
    };

    const handleUpdateSubject = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${API_URL}/admin/subjects/edit`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Subject updated successfully!');
            setShowEditModal(false);
            setEditingSubject(null);
            fetchSubjects();
        } catch (error) {
            console.error('Error updating subject:', error);
            alert('Error updating subject');
        }
        setLoading(false);
    };

    const handleDeleteSubject = async (subjectCode) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                await axios.delete(`${API_URL}/admin/subjects/${subjectCode}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                alert('Subject deleted successfully!');
                fetchSubjects();
            } catch (error) {
                console.error('Error deleting subject:', error);
                if (error.response?.status === 404) {
                    alert('Subject not found. It may have been already deleted.');
                } else {
                    alert('Error deleting subject. Please try again.');
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Subject Management</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Create Subject Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Add New Subject</h2>
                        <form onSubmit={handleCreateSubject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <div className="space-y-2">
                                    {departments.map((dept) => (
                                        <label key={dept} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="department"
                                                value={dept}
                                                checked={formData.department.includes(dept)}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            {dept}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map((sem) => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <div className="space-y-2">
                                    {types.map((type) => (
                                        <label key={type} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="type"
                                                value={type}
                                                checked={formData.type.includes(type)}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Subject'}
                            </button>
                        </form>
                    </div>

                    {/* Subject List */}
                    <div className="bg-white rounded-lg shadow-md p-6 overflow-y-scroll max-h-[70vh]">
                        <h2 className="text-xl font-semibold mb-4">Subject List</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {subjects.map((subject) => (
                                <div key={subject.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold">{subject.name}</h3>
                                            <p className="text-gray-600">Code: {subject.code}</p>
                                            <p className="text-gray-600">Department: {subject.department.join(', ')}</p>
                                            <p className="text-gray-600">Semester: {subject.semester}</p>
                                            <p className="text-gray-600">Year: {subject.year}</p>
                                            <p className="text-gray-600">Type: {subject.type.join(', ')}</p>
                                            <p className="text-gray-600">
                                                Faculty: {subject.faculty ? `${subject.faculty.name} (${subject.faculty.department})` : 'Not Assigned'}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditSubject(subject)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSubject(subject.code)}
                                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Assign Faculty Form */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Assign Faculty to Subject</h2>
                    <form onSubmit={handleAssignFaculty} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                            <select
                                name="subjectCode"
                                value={assignmentData.subjectCode}
                                onChange={handleAssignmentChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.code}>
                                        {subject.name} ({subject.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                            <select
                                name="facultyId"
                                value={assignmentData.facultyId}
                                onChange={handleAssignmentChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Faculty</option>
                                {faculty.map((fac) => (
                                    <option key={fac.id} value={fac.id}>
                                        {fac.name} - {fac.department}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Assigning...' : 'Assign Faculty'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Subject</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <div className="space-y-2">
                                    {departments.map((dept) => (
                                        <label key={dept} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="department"
                                                value={dept}
                                                checked={formData.department.includes(dept)}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            {dept}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map((sem) => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <div className="space-y-2">
                                    {types.map((type) => (
                                        <label key={type} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="type"
                                                value={type}
                                                checked={formData.type.includes(type)}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Update Subject'}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                </div>
            )}
        </div>
    );
} 