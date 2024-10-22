import React, { useState } from 'react';
import { Navigate, Router, useNavigate } from 'react-router-dom';

export default function Login() {
    const [userType, setUserType] = useState('student');
const router = useNavigate()
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Login submitted for', userType);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-[350px] border p-4 rounded shadow">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Login</h2>
                    <p className="text-gray-600">Enter your credentials to access your account.</p>
                </div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    placeholder="Enter your username"
                                    className="border p-2 rounded"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="border p-2 rounded"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label>User Type</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="student"
                                        id="student"
                                        checked={userType === 'student'}
                                        onChange={() => setUserType('student')}
                                    />
                                    <label htmlFor="student">Student</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="faculty"
                                        id="faculty"
                                        checked={userType === 'faculty'}
                                        onChange={() => setUserType('faculty')}
                                    />
                                    <label htmlFor="faculty">Faculty</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="parent"
                                        id="parent"
                                        checked={userType === 'parent'}
                                        onChange={() => setUserType('parent')}
                                    />
                                    <label htmlFor="parent">Parent</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button type="button" className="px-4 py-2 border rounded">
                                Cancel
                            </button>
                            <button type="submit" onClick={()=>{
                                router("/home")
                            }} className="px-4 py-2 bg-blue-500 text-white rounded">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
