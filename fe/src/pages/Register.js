import './Register.css';
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineComment } from 'react-icons/ai';
import { useState } from 'react';
import { API_BASE_URL } from '../config'
import { toast } from 'react-toastify'
import axios from 'axios';

const Register = () => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const register = (event) => {
        event.preventDefault();
        setLoading(true);
        const requestData = { fullName: fullName, email: email, username: username, password: password };
        axios.post(`${API_BASE_URL}/auth/register`, requestData)
            .then((result) => {
                if (result.status === 201) {
                    setLoading(false);
                    toast.success('User Successfully Registered');
                    navigate('/login');
                }
                setFullName('');
                setEmail('');
                setUsername('');
                setPassword('');
            }).catch((err) => {
                console.log(err.message);
                setLoading(false);
                toast.error(err.response.data.error);
            });
    }


    return (
        <div className="container register-container">
            {/* Registration Form */}
            <div className="row shadow mx-auto w-75">

                {/* Twitter Icon and Join Us Message */}
                <div className="col-md-5 col-sm-12 twitter-icon d-flex flex-column rounded-start">
                    <h3 className='my-3'>Join Us</h3>
                    <AiOutlineComment className="mb-5" size={75} />
                </div>
                {/* Form Start */}
                <div className="col-md-7 col-sm-12 text-start register-form rounded-end border">
                    <h5 className="my-4 fs-3 fw-bold">Register</h5>
                    <form onSubmit={(e) => register(e)}>
                        <div className="mb-3 ms-2 ">
                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-control" id="fullname" placeholder="Full Name" />
                        </div>
                        <div className="mb-3 ms-2 ">
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder="Email" />
                        </div>
                        <div className="mb-3 ms-2 ">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" id="username" placeholder="Username" />
                        </div>
                        <div className="mb-3 ms-2 ">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" placeholder="Password" />
                        </div>
                        {loading ?
                            <button type="submit" className="btn btn-light-outline ms-3 disabled">Loading...</button>
                            : <button type="submit" className="btn btn-dark ms-3">Register</button>
                        }
                    </form>
                    <div className='my-3 mb-5'>
                        <button className="custom-btn btn text-start">
                            <span className='text-muted fs-6'>Already registered?</span>
                            <Link to='/login' className='ms-1 fw-bold'>Login here</Link>
                        </button>
                    </div>
                </div>
                {/* Form End */}
            </div>
        </div>
    );
}

export default Register;