import React, { useState } from 'react'
import './Signup.css'
import logo from '../images/white-twitter.png'
import axios from 'axios';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../src/config'

export default function Signup() {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const signup = (event) => {
        event.preventDefault();

        setLoading(true);
        const requestData = { fullName: fullName, email, password }
        axios.post(`${API_BASE_URL}/signup`, requestData)
            .then((result) => {
                if (result.status === 201) {
                    setLoading(false);
                    Swal.fire({
                        icon: 'success',
                        title: 'User successfully registered'
                    })
                }
                setFullName('');
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Some error occurred please try again later!'
                })
            })
    }

    

    return (
        <div className='signup-body'>
            <div className="card my-3 shadow signup-card-body" >
                <div className="row g-0 w-100">
                    <div className="col-md-4 signup-column-1 text-center">
                        <h3>Register Now</h3>
                        <img src={logo} alt='logo' height='150vh'></img>
                    </div>
                    <div className="col-md-8 signup-column-2">
                        <div className="card-body">
                            <h3 className="card-title px-3 py-2 "><b>Register</b></h3>
                            <form className='px-3'onSubmit={signup} >
                                <div className="mb-3">
                                    <input   value={fullName} onChange={(ev) => setFullName(ev.target.value)} type="text" className="form-control" id="exampleInputFullName" placeholder='Full Name' />
                                </div>
                                <div className="mb-3">
                                    <input   value={email} onChange={(ev) => setEmail(ev.target.value)}  type="email" className="form-control" id="exampleInputEmail" placeholder='Email' aria-describedby="emailHelp" />
                                </div>
                               
                                <div className="mb-3">
                                    <input  value={password} onChange={(ev) => setPassword(ev.target.value)}  type="password" className="form-control" id="exampleInputPassword" placeholder='Password' />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    {loading ? <div className="spinner-border spinner-border-sm text-light mt-1 mx-4" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                        : 'Register'}
                                </button>
                            </form>
                            <p className="card-text mt-4 px-3"><small className="text-body-secondary">Already have an account? </small><Link className='text-primary' to='/login'><b>Login here.</b></Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
