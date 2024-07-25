import React from 'react'
import Sidebar from '../components/Sidebar'
import Profile from '../components/Profile'

export default function ProfilePage() {
    return (
        <div className='d-flex flex-row'>
            <Sidebar />
            <Profile />
        </div>
    )
}
