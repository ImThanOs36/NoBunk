import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function FacultyDashboard() {
    const navigate = useNavigate()

    const facultyData = {
        name: localStorage.getItem('facultyname'),
        department: localStorage.getItem('department'),
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Faculty Information Card */}
                    <div className="md:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white">Faculty Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-gray-700">Faculty: <span className="font-semibold">{facultyData.name}</span></span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="text-gray-700">Department: <span className="font-semibold">{facultyData.department} Engineering</span></span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-700">Today: <span className="font-semibold">{new Date().toLocaleDateString()}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
                            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <button
                                    onClick={() => navigate("/create-class")}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Create Class</span>
                                </button>
                                <button
                                    onClick={() => navigate("/class-records")}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>Class Records</span>
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.clear()
                                        navigate("/faculty/login")
                                    }}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}