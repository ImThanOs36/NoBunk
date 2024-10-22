const attendanceData = {
    studentName: 'Shubham Lad',
    rollNumber: 'CW 19',
    department: 'Computer Science',
    year: 'Third Year',
    totalClasses: 50,
    attendedClasses: 45,
    attendancePercentage: 90,
    detailedAttendance: [
      { date: '2024-10-01', subject: 'Advanced Java', status: 'Present' },
      { date: '2024-10-01', subject: 'Software Testing', status: 'Absent' },
      { date: '2024-10-02', subject: 'Operating System', status: 'Present' },
      { date: '2024-10-03', subject: 'Environment Studies', status: 'Present' },
      { date: '2024-10-04', subject: 'Client Side Scripting', status: 'Present' },
    ],
  };
  
  export default function AttendanceSummary() {
    return (
      <div style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Attendance Summary</h1>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>Student Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p style={{ fontWeight: 'bold' }}>Name:</p>
              <p>{attendanceData.studentName}</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold' }}>Roll Number:</p>
              <p>{attendanceData.rollNumber}</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold' }}>Department:</p>
              <p>{attendanceData.department}</p>
            </div>
            <div>
              <p style={{ fontWeight: 'bold' }}>Year:</p>
              <p>{attendanceData.year}</p>
            </div>
          </div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>Overall Attendance</h2>
          <p>Your attendance record for this semester</p>
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Attendance Rate</span>
              <span>{attendanceData.attendancePercentage}%</span>
            </div>
            <progress
              value={attendanceData.attendancePercentage}
              max="100"
              style={{ width: '100%' }}
            />
            <p style={{ marginTop: '8px' }}>
              Classes Attended: {attendanceData.attendedClasses} / {attendanceData.totalClasses}
            </p>
          </div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>Detailed Attendance</h2>
          <p>Your day-by-day attendance record</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Subject</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.detailedAttendance.map((entry, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{entry.date}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{entry.subject}</td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      color: entry.status === 'Present' ? 'green' : 'red',
                    }}
                  >
                    {entry.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  