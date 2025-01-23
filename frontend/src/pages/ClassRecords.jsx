import axios from "axios"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function ClassRecords() {
    const [classDatas, setClassData] = useState([])
    const [filteredClass, setFilteredClass] = useState([])
    const facultyId = localStorage.getItem('id');
    const navigate = useNavigate()
    async function getClassData() {

        axios.post("http://localhost:3000/facultyclass", facultyId).then((response) => {
            const classData = response.data;
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

    const clerFilter = () => {
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
    const date = new Date()
    date.toLocaleTimeString()
    return <div className="capitalize">
        <Navbar />
        <div className="p-4 text-xl ">

            <div className="border-2 border-black rounded-lg text-xl p-4" >
                <p >Faculty Name: {facultyData.name} </p>
                <p>Department: {facultyData.department} Engineering </p>
            </div>
            <div className="border-2 border-black rounded-lg  mt-5 p-4">
                <span>Attendance Records</span>
                <input type="date" onChange={(e) => {
                    sortByDate(e.target.value)
                }} />
                <button onClick={() => {
                    clerFilter()
                }}> Clear Filter</button>
                <table className="table w-full">

                    <thead className="p-2 border-2 border-black bg-black text-white">
                        <tr>

                            <th className="p-2 border border-r-white">Faculty Name</th>
                            <th className="border border-r-white">department</th>
                            <th className="border border-r-white">Subject</th>
                            <th className="border border-r-white">Date</th>
                            <th className="border border-r-white"></th>
                        </tr>

                    </thead>
                    <tbody>


                        {filteredClass.map((cls, index) => {
                            return <tr key={index} className="  border-2 border-black">

                                <td className="border border-r-black">{cls.facultyname}</td>
                                <td className="text-center p-2 border border-r-black">{cls.department} Engineering</td>
                                <td className="text-center border border-r-black">{cls.subject}</td>
                                <td className="text-center border border-r-black">{new Date(cls.time).toLocaleDateString()}</td>
                                <td className="text-center border border-r-black ">

                                    <Link target="_blank" className="bg-green-500 p-2  w-full block" to={`/classattendance/${cls.id}`}>      View Attendances</Link>


                                </td>
                            </tr>
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    </div>


}