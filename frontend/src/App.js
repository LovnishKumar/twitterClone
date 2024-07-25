import React from 'react'
import './App.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import OtherProfile from './pages/2_Profile_page';

export default function App() {
    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profilePage_2/:userId" element={<OtherProfile />} />

                </Routes>
        </BrowserRouter>
    )
}
