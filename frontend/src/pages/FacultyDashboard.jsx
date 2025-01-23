import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function FacultyDashboard() {

    const navigate = useNavigate()

    const facultyData = {
        name: localStorage.getItem('name'),
        department: localStorage.getItem('departetn'),

    }
    return (

        <div>
            <Navbar />
            <div>
                <div className="flex gap-1 p-4 flex-col md:flex-row">
                    <div className='capitalize w-full md:w-3/4  border-2 border-black  flex flex-col gap-2 rounded-lg'>
                        <span className='text-center text-2xl w-full bg-black text-white py-2'>
                            Faculty Information
                        </span>
                        <div className='p-6'>

                            <p className="">
                                Faculty : {facultyData.name}
                            </p>
                            <p className="">
                                Department: {facultyData.department} Engineering
                            </p>

                            <p>
                                Today Date : {new Date().toDateString()}
                            </p>
                        </div>
                    </div>
                    

                        <div className="flex gap-1 flex-col border-2 border-black rounded-lg  w-full md:w-1/4">

                            <span className="w-full p-2 bg-black text-white text-xl text-center font-bold">Class actions</span>
                            <div className="p-2 flex gap-2 flex-col">

                                <button className=" py-2 px-4 bg-black text-white rounded-lg" onClick={() => {
                                    navigate("/createclass")
                                }}>Create Class</button>
                                <button className=" py-2 px-4 bg-black text-white rounded-lg" onClick={() => {
                                    navigate("/classrecords")
                                }}>Class records</button>

                            </div>

                        </div>

                 

                </div>

            </div>
        </div>
    )




}