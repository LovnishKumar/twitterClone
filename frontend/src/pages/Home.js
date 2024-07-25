import React from 'react'
import Sidebar from '../components/Sidebar'
import Feed from '../components/Feed'

export default function Home() {
    return (
        <div className='d-flex flex-row'>
            <Sidebar />
            <Feed />
        </div>
    )
}
