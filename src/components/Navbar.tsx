import { useRef } from 'react';
import { useAuth } from './../context/AuthContext';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import avatar from './../images/default-avatar.png';

function Navbar() {
    const { currentUser }: any = useAuth()

    return (
        <div className="navbar bg-base-100 mb-4 shadow-xl rounded-box">
            <div className="navbar-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost normal-case text-xl">Chat App</a>
            </div>
            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>

                <div className='dropdown dropdown-hover dropdown-end'>
                    <label tabIndex={0}>
                        <img src={currentUser.profilePictUrl ?? avatar} alt="Avatar" className='mask mask-circle' width={60} />
                    </label>
                    <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
                        <li><Link to="/settings">Pengaturan</Link></li>
                        <li><Link to="/teman">Teman</Link></li>
                    </ul>
                </div>
            </div>
        </div >
    )
}

export default Navbar