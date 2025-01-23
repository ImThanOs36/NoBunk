import axios from 'axios';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { debounce } from 'lodash'

const subjects = {

  Computer: ['Advanced Java', 'Operating System', 'Client Side Scripting', 'Environment Studies', 'Software Testing'],
  Electrical: ['Electrical Machines', 'Power Systems', 'Control Systems', 'Environment Studies', 'Electrical Measurements'],
  Mechanical: ['Thermodynamics', 'Machine Design', 'Manufacturing Processes', 'Environment Studies', 'Fluid Mechanics'],
  Civil: ['Structural Analysis', 'Geotechnical Engineering', 'Surveying', 'Environment Studies', 'Transportation Engineering']
};

const departments = ['Computer', 'Electrical', 'Mechanical', 'Civil'];
const years = ['First Year', 'Second Year', 'Third Year'];

export default function CreateClass() {


  const [studentData, setStudentData] = useState([]);
  const [attendancesData, setattendancesData] = useState([]);
  const [classData, setClassData] = useState()
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('')
  const [year, setYear] = useState('')
  const [type, setType] = useState('lecture')


  const faculty = {
    name: localStorage.getItem("name"),
    role: localStorage.getItem("role"),
    department: localStorage.getItem("department"),
    facultyId: localStorage.getItem('facultyId')
  }
  async function getData() {
    if (department == '' | subject == '' | year == '') {
      alert("select all fileds")
    } else {
      try {

        const data = await axios.post("http://localhost:3000/allstudents", { year, department });
        const sortedData = data.data.sort((a, b) => {
          return Number(a.rollNumber) - Number(b.rollNumber);
        });

        console.log(sortedData);
        setStudentData(sortedData);
        setClassData({ faculty: faculty.name, subject: subject, type: type, department: department, year: year, facultyId: 1 });
      } catch (error) {
        alert(error)
      }
    }

  }


  const [present, setPresent] = useState([])



  const handleSubmit = debounce((id) => {
    if (present.includes(id)) {
      const presentTogle = present.filter((presentId) => presentId !== id);
      setPresent(presentTogle);
      setattendancesData(
        attendancesData.map((item) =>
          item.studentId === id ? { ...item, status: "Absent" } : item
        )
      );
    } else {

      setPresent([...present, id]);

      const studentExists = attendancesData.some((item) => item.studentId === id);

      if (studentExists) {
        setattendancesData(
          attendancesData.map((item) =>
            item.studentId === id ? { ...item, status: "Present" } : item
          )
        );
      } else {
        setattendancesData([...attendancesData, { studentId: id, status: "Present" }]);
      }
    }
  }, 300);


  async function submitData() {
    const allStudentIds = studentData.map((student) => student.enrNumber);
    const absentData = allStudentIds
      .filter((enrNumber) => !attendancesData.some((item) => item.studentId === enrNumber))
      .map((studentId) => ({ studentId, status: "Absent" }));

    const attendanceData = [...attendancesData, ...absentData];
    const finalData = { ...classData, attendanceData };
    function resetStates() {
      setClassData(null);
      setattendancesData([]);
      setStudentData([]);
      setPresent([]);
      setYear('');
      setDepartment('');
      setSubject('');
    }

    try {
      const response = await axios.post("http://localhost:3000/class", finalData);
      console.log("Class data submitted:", response.data);
      resetStates();
      console.log('Before reset:', classData);
      setClassData(null);
      console.log('After reset:', classData);


      alert("Class data submitted successfully!");
    } catch (error) {
      console.error("Error submitting class data:", error);
      alert("Failed to submit class data. Please try again.");
    }


  }




  return (
    <div>
      <Navbar />
      <div className='p-4 font-excon flex gap-2 md:gap-52 text-lg flex-wrap md:flex-nowrap '>
        <div className='flex gap-1 flex-wrap w-full md:w-1/3'>
          <label htmlFor="year">Year - (FY,SY,TY) :</label>
          <select name="year" id="year" className='border-2 rounded-lg border-black px-8 py-2 w-full' onChange={(e) => {
            setYear(e.target.value)
          }}>
            <option value="TY">
              Select a year
            </option>
            {years.map((year, index) => (

              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label htmlFor="department">Department :</label>
          <select name="department" id="department" className='border-2 rounded-lg border-black px-8 py-2 min-w-12 w-full' onChange={(e) => {
            setDepartment(e.target.value)
          }}>
            <option value="">
              Select a department
            </option>
            {departments.map((subject, index) => (

              <option key={index} value={subject}>
                {subject} Engineering
              </option>
            ))}
          </select>

          <label htmlFor="subjects">Subject :</label>
          <select name="subjects" id="subject" className='border-2 rounded-lg border-black px-8 py-2 w-full' onChange={(e) => {
            setSubject(e.target.value)
          }}> <option value="">
              Select a subject
            </option>
            {department ?

              subjects[department].map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))
              : null}
          </select>
          <label htmlFor="type">Lecture / Practical :</label>
          <select name="type" id="type" className='border-2 rounded-lg border-black px-8 py-2 min-w-12 w-full' onChange={(e) => {
            setType(e.target.value)
          }}>
            <option value="" disabled>
              Select lecture or practical
            </option>

            <option value="lecture">
              Lecture
            </option>
            <option value="practical">
              Practical
            </option>

          </select>
          <button className='px-6 h-min py-2 bg-blue-500 border-2 border-black rounded-lg text-white' onClick={() => { getData() }}>Create Class</button>
        </div>

        <div className='capitalize w-full md:w-1/3 border-2 border-black  flex flex-col gap-2 rounded-lg'>
          <span className='text-center text-2xl w-full bg-black text-white py-2'>
            Class Information
          </span>
          <div className='p-6'>

            <p className="">
              Faculty : {faculty.name}
            </p>
            <p className="">
              Department: {department} Engineering
            </p>
            <p>Year: {year}</p>
            <p>
              Subject : {subject}
            </p>
            <p>
              Date : {new Date().toDateString()}
            </p>
          </div>
        </div>


      </div>
      <div className='p-6 border-2 border-black rounded-lg m-4'>
        <div className=''>
          <table className=' border w-full border-collapse capitalize text-2xl font-excon'>

            <thead className='bg-black text-white font-normal'>
              <tr className=''>
                <th className='border font-normal '>Roll No</th>
                <th className='border font-normal'>Student Name</th>
                <th className='border font-normal'>Enr Number</th>
                <th className='border font-normal'>department</th>
                <th className='border font-normal'>year</th>
                <th className='border font-normal'>status</th>
                <th className='border font-normal'>mark</th>
              </tr>
            </thead>
            <tbody>

              {studentData.map((student, index) => {
                return <tr key={index} className='border'>
                  <td className='border p-1'>{student.rollNumber}</td>
                  <td className='border p-1' >{student.name}</td>
                  <td className='border p-1 text-center' >{student.enrNumber}</td>
                  <td className='border p-1 text-center' >{student.department}</td>
                  <td className='border p-1 text-center'>{student.year}</td>
                  <td className='border p-1 text-center' >{present.includes(student.enrNumber) ? "Present" : "Absent"}</td>
                  <td>

                    <button onClick={() => {
                      handleSubmit(student.enrNumber)
                    }}>{present.includes(student.enrNumber) ? "Mark as Absent" : " Mark As Present"}</button>
                  </td>

                </tr>
              })}


            </tbody>
          </table>

        </div>
        <button className='px-8 py-3 bg-black rounded-lg text-white' onClick={async () => {
          const isConfirm = confirm("Click Ok To Confirm")
          if (isConfirm) {
            submitData()
          }

        }}>Submit Class</button>
      </div>
    </div>
  )

};

