import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, Router, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function StudentLogin() {
    const navigate = useNavigate()
    const [username, setUsername] = useState()

    async function login() {
        try {
            axios.post("http://localhost:3000/student/login", { username }).then((response) => {
                localStorage.setItem('name', response.data.name)
                localStorage.setItem('role', response.data.role)
                localStorage.setItem('enrNumber', response.data.enrNumber)
                localStorage.setItem('department', response.data.department)

                navigate("/summary/" + response.data.enrNumber)
            })
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='overflow-hidden h-screen'>

            <Navbar />

            <div className='w-full flex font-ranade'>
                <div className=' w-1/2 hidden sm:flex items-center justify-center h-screen bg-black text-white  text-4xl'>
                    Login to your Student account
                </div>
                <div className='w-full sm:w-1/2 flex items-center justify-center h-screen bg-gray-100'>
                    <div className='flex flex-col md:w-1/2 border-2 bg-white border-gray-600 p-4 rounded-xl  font-semibold pt-6'>
                        <label htmlFor="username" className='p-2 text-gray-600'>Enrollment Number</label>
                        <input className='w-full border-2  rounded-lg py-2 px-6' type="text" name="" placeholder='Enter Email Id /username' id="username" onChange={(e) => {
                            setUsername(Number(e.target.value))
                        }} />
                        <button className='w-full mt-4 bg-black text-white py-2 px-4 rounded-lg' onClick={() => {
                            login()
                        }}>Login</button>

                    </div>
                </div>


            </div>

        </div>

    )
}