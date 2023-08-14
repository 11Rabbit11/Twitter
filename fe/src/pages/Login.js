import './Login.css';
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineComment } from 'react-icons/ai';
import { useState } from 'react';
import { API_BASE_URL } from '../config'
import { toast } from 'react-toastify'
import axios from 'axios';

const Login = () => {

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();
        setLoading(true);
        const requestData = { username, password };
         await axios.post(`${API_BASE_URL}/auth/login`, requestData)
            .then((result) => {
                if (result.status === 200) {
                    
                    const token =  result.data.result.token;
                    const user =  result.data.result.user;

                    localStorage.setItem('token', (token));
                    localStorage.setItem('user', JSON.stringify(user));
                    setLoading(false);
                   
                    
                    toast.success('Logged In Successfully', {
                        autoClose: 2000,
                    });
                    navigate('/home');
                }
            }).catch((err) => {
                console.log(err.message);
                setLoading(false);
                // toast.error(err.response.data.error);
            });
    }

    return (
        <div className="container login-container">
            {/* Login Form */}
            <div className="row shadow mx-auto w-75">

                {/* Twitter Icon and Welcome Message */}
                <div className="col-md-5 col-sm-12 twitter-icon d-flex flex-column rounded-start">
                    <h3 className='my-3'>Welcome Back</h3>
                    <AiOutlineComment className="mb-5" size={75} />
                </div>

                {/* Form Start */}
                <div className="col-md-7 col-sm-12 text-start login-form rounded-end border">

                    <h5 className="my-4 fs-3 fw-bold">Log In</h5>

                    <form onSubmit={(e) => login(e)}>
                        <div className="mb-3 ms-2 ">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" id="username" placeholder="Username" />
                        </div>
                        <div className="mb-3 ms-2 ">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" placeholder="Password" />
                        </div>
                        {loading ?
                            <button type="submit" className="btn btn-light-outline ms-3 disabled">Loading...</button>
                            : <button type="submit" className="btn btn-dark ms-3">Log In</button>
                        }
                    </form>

                    <div className='my-3 mb-5'>
                        <button className="custom-btn btn text-start">
                            <span className='text-muted fs-6'>Don't have an acccount?</span>
                            <Link to='/register' className='ms-1 fw-bold'>Register here</Link>
                        </button>
                    </div>

                </div>
                {/* Form End */}
            </div>
        </div>


    );
}

export default Login;
