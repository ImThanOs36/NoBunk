import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (

        <nav className='font-ranade   bg-white text-black border-b-2 border-b-black p-4 flex justify-between items-center'>
            <Link className='text-4xl' to={"/"}>Tkiet Polytechnic</Link>
            <div className=' text-xl flex gap-2 flex-wrap justify-end'>

                <button className='bg-black text-white py-2 px-4 rounded-md'>
                    <a href="/facultylogin"> Faculty</a>


                </button>
                <button className='bg-black text-white py-2 px-4 rounded-md'>
                    <a href="/studentlogin"> Student</a>

                </button>
            </div>
        </nav >
    );
}

export default Navbar;
