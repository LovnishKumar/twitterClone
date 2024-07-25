import React, { useState } from 'react';
import './Login.css';
import logo from '../images/white-twitter.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '../../src/config';

export default function Login() {

    //Required States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = (event) => {
        //For preventing data when function applies
        event.preventDefault();
        setLoading(true);

        //Fetching Data
        const requestData = { email, password }
        axios.post(`${API_BASE_URL}/login`, requestData)
        .then((result) => {
            if (result.status === 200) {
                setLoading(false);
                localStorage.setItem("token", result.data.result.token);
                localStorage.setItem('user', JSON.stringify(result.data.result.user));
                dispatch({ type: 'LOGIN_SUCCESS', payload: result.data.result.user });
                setLoading(false);
                navigate('/home');

                // Display success message with SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'Welcome to your account.',
                    confirmButtonColor: '#28a745', // You can customize the button color
                });
            }
        })

            .catch((error) => {
                console.log(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.error
                })
            })
    }

    return (
        <div className="login-body">
            <div className="card my-3 shadow login-card-body">
                <div className="row g-0">
                    <div className="col-md-4 login-column-1 text-center">
                        <h3>Login Now</h3>
                        <img src={logo} alt="logo" height="150vh"></img>
                    </div>
                    <div className="col-md-8 login-column-2">
                        <div className="card-body">
                            <h3 className="card-title px-3 py-2">
                                <b>Login</b>
                            </h3>
                            <form className="px-3" onSubmit={login}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exampleInputUsername1"
                                        placeholder="Username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary login-btn">
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm text-light mt-1 mx-3" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                             
                            </form>
                            <p className="card-text mt-4 px-3">
                                <small className="text-body-secondary">Don't have an account? </small>
                                <Link className='text-primary' to="/signup">
                                    <b>Register here.</b>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
