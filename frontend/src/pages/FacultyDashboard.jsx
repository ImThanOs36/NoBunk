import { useState } from 'react';

const students = [
  { id: 1, name: 'Shubham Lad', rollNumber: 'CW 19', department: 'Computer Science', year: 'Third Year', present: false },
  { id: 2, name: 'Pratik Chavan', rollNumber: 'CW 07', department: 'Computer Science', year: 'Third Year', present: false },
  { id: 3, name: 'Anand Kamble', rollNumber: 'CW 13', department: 'Computer Science', year: 'Third Year', present: false },
  { id: 4, name: 'Saniya Chavan', rollNumber: 'CW 33', department: 'Computer Science', year: 'Third Year', present: false },
  { id: 5, name: 'Sahil Kamble', rollNumber: '14', department: 'Computer Science', year: 'Third Year', present: false },
];

const subjects = ['Advanced Java', 'Operating System', 'Client Side Scripting', 'Enviroment Studies', 'Software Testing'];
const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
const years = ['First Year', 'Second Year', 'Third Year'];

export default function FacultyDashboard() {
  const [attendanceList, setAttendanceList] = useState(students); 
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const handleAttendance = (id) => {
    setAttendanceList(attendanceList.map(student =>
      student.id === id ? { ...student, present: !student.present } : student
    ));
  };

  const filteredStudents = attendanceList.filter(student =>
    (!selectedDepartment || student.department === selectedDepartment) &&
    (!selectedYear || student.year === selectedYear)
  );

  const submitAttendance = () => {
    if (!date || !subject) {
      alert('Please select a date and subject');
      return;
    }
    const attendanceData = {
      date,
      subject,
      department: selectedDepartment,
      year: selectedYear,
      attendance: filteredStudents,
    };
    console.log('Attendance submitted:', attendanceData);
    // Reset the form after submission
    setDate('');
    setSubject('');
    setSelectedDepartment('');
    setSelectedYear('');
    setAttendanceList(students.map(student => ({ ...student, present: false })));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Faculty Dashboard</h1>
      <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2>Create New Attendance Entry</h2>
          <p>Mark attendance for a class</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <label htmlFor="subject">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            >
              <option value="" disabled>Select subject</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="department">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            >
              <option value="" disabled>Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            >
              <option value="" disabled>Select year</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Roll Number</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Department</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Year</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Present</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{student.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{student.rollNumber}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{student.department}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{student.year}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={student.present}
                    onChange={() => handleAttendance(student.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={submitAttendance}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}
