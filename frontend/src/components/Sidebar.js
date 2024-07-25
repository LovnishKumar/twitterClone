import React from 'react';
import logo from '../images/mainlogo.webp';
import profilePic from '../images/Twitter.jpg';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Sidebar() {
    const user = useSelector((state) => state.userReducer);
    return (
        <div className='sidebar-body sidebar'>
            <img src={logo} height={"70vh"} className='ms-3 logo' alt="Logo" />
            <div className='d-flex flex-column mt-3 ms-4 menu'>
                {/* Navlinks are react component which are used for navbar links */}
                <NavLink className='menu-item fw-bold p-2 ps-3' to='/home'>
                <i className="fa-solid fa-house-user d-md-block d-none ">{' '}Home</i>
                <i className="fa-solid fa-house-user d-md-none d-block "></i>
                   <br/>
                </NavLink>
                <NavLink className='menu-item fw-bold p-2 ps-3' to='/profile'>
                <i className="fa-solid fa-user  d-md-block d-none ">{' '}Profile</i>
                <i className="fa-solid fa-user d-md-none d-block"></i>
                </NavLink>
                <br/>
                <NavLink className='menu-item fw-bold p-2 ps-3' to='/login'>
                <i className="fa-solid fa-arrow-right-from-bracket  d-md-block d-none  ">{' '}Logout</i>
                <i className="fa-solid fa-arrow-right-from-bracket  d-md-none d-block  "></i>
                </NavLink>
                <div className='position-absolute bottom-0 pb-4 d-flex flex-column profile-section'>
                    <img src={profilePic} height={"50vh"} className='profilepic' alt="Profile" />
                    <h4 className='profilename fw-bold '>{user.user.fullName}</h4>
                </div>
                
                
            </div>
        </div>
    );
}
