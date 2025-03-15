import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SubjectManagement() {
    const [subjects, setSubjects] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: [],
        semester: '',
        year: '',
        type: [] // Initialize as empty array
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
    }, []);

    const fetchFaculty = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/faculty', {
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
            // Special handling for checkboxes
            const newTypes = [...formData.type];
            if (e.target.checked) {
                // Add the value if checkbox is checked
                newTypes.push(value);
            } else {
                // Remove the value if checkbox is unchecked
                const index = newTypes.indexOf(value);
                if (index > -1) {
                    newTypes.splice(index, 1);
                }
            }
            setFormData(prev => ({
                ...prev,
                type: newTypes
            }));
        }

        else if (name === 'department') {
            // Special handling for checkboxes
            const newTypes = [...formData.department];
            setFormData(prev => ({
                ...prev,
                [name]: [value]
            }));
        }


        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAssignmentChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateSubject = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/admin/subject/create', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Subject created successfully!');
            setFormData({
                name: '',
                code: '',
                department: '',
                semester: '',
                year: '',
                type: 'lecture'
            });
        } catch (error) {
            console.error('Error creating subject:', error);
            alert('Error creating subject');
        }
        setLoading(false);
    };

    const handleAssignFaculty = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/admin/subject/assign', assignmentData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Faculty assigned successfully!');
            setAssignmentData({
                subjectCode: '',
                facultyId: ''
            });
        } catch (error) {
            console.error('Error assigning faculty:', error);
            alert('Error assigning faculty');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Subject Management</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Create Subject Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Create New Subject</h2>
                        <form onSubmit={handleCreateSubject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
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
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
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
                                        <option key={sem} value={sem}>Semester {sem}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <div className="space-y-2">
                                    {types.map((type) => (
                                        <label key={type} className="inline-flex items-center mr-4">
                                            <input
                                                type="checkbox"
                                                name="type"
                                                value={type}
                                                checked={formData.type.includes(type)}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {/* Debug display */}
                               
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

                    {/* Assign Faculty Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Assign Faculty to Subject</h2>
                        <form onSubmit={handleAssignFaculty} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                                <input
                                    type="text"
                                    name="subjectCode"
                                    value={assignmentData.subjectCode}
                                    onChange={handleAssignmentChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
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
                                        <option key={fac.id} value={fac.id}>{fac.name} - {fac.department}</option>
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
            </div>
        </div>
    );
} 