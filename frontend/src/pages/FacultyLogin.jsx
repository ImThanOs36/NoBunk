import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FacultyLogin() {
    const navigate = useNavigate()
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    console.log(isLoggedIn)

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/faculty")
        }
    }, [])

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    async function login() {
        try {
            axios.post("http://localhost:3000/faculty/login", { username, password }).then((response) => {
                console.log(response.data)
                localStorage.setItem('token', response.data.data.token)
                localStorage.setItem('facultyname', response.data.data.name)
                localStorage.setItem('role', response.data.data.role)
                localStorage.setItem('department', response.data.data.department)
                localStorage.setItem('id', response.data.data.id)
                localStorage.setItem('isLoggedIn', response.data.data.isLoggedIn)

                navigate("/faculty")
            })
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='overflow-hidden h-screen'>
            <div className='w-full flex font-ranade'>
                <div className=' w-1/2 hidden sm:flex items-center justify-center h-screen bg-black text-white  text-4xl'>
                    Login to your faculty account
                </div>
                <div className='w-full sm:w-1/2 flex items-center justify-center h-screen bg-gray-100'>
                    <div className='flex flex-col md:w-1/2 border-2 bg-white border-gray-600 p-4 rounded-xl min-h-80 font-semibold pt-6'>
                        <label htmlFor="username" className='p-2 text-gray-600'>Email Id</label>
                        <input className='w-full border-2  rounded-lg py-2 px-6' type="text" name="" placeholder='Enter Email Id /username' id="username" onChange={(e) => {
                            setUsername(e.target.value)
                        }} />
                        <label htmlFor="password" className='p-2  text-gray-600'>Password</label>
                        <input type="password" className='w-full border-2  rounded-lg py-2 px-6' name="" placeholder='Enter password' id="password" onChange={(e) => {
                            setPassword(e.target.value)
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