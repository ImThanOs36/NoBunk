import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL)

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`${API_URL}/admin/login`, formData);
            const { token, admin } = response.data.data;

            // Store token and admin info in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('adminInfo', JSON.stringify(admin));

            // Redirect to admin dashboard
            navigate('/admin');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className='overflow-hidden h-screen'>
            <div className='w-full flex font-ranade'>



                <div className=' w-1/2 hidden sm:flex items-center justify-center h-screen bg-black text-white  text-4xl'>
                    Login to your Admin account
                </div>


                <div className='w-full sm:w-1/2 flex items-center justify-center h-screen bg-gray-100'>
                    <form className="mt-8 space-y-6 flex flex-col md:w-1/2 border-2 bg-white border-gray-600 p-4 rounded-xl min-h-80 font-semibold pt-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-2">

                            <label htmlFor="email" className=" p-2 text-gray-600">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full border-2  rounded-lg py-2 px-6"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                
                            />


                            <label htmlFor="password" className=" p-2  text-gray-600">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full border-2  rounded-lg py-2 px-6"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="w-full mt-4 bg-black text-white py-2 px-4 rounded-lg"
                            >
                                Sign in
                            </button>

                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 