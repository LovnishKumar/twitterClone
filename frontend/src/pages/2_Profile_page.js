import React from 'react'
import Sidebar from '../components/Sidebar'
import ModifiedProfile from '../components/Profile_2'

export default function OtherProfile() {
    return (
        <div className='d-flex flex-row'>
            <Sidebar />
            <ModifiedProfile />
        </div>
    )
}
