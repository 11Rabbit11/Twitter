import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import TweetCard from '../components/TweetCard';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import params from 'react-router-dom';

const Tweet = styled.div`
  overflow-y: auto;
  height: 65vh;
`;

const Profile = () => {
    
    const params = useParams();
    const [user, setUser] = useState({});
    const [requser, setReqUser] = useState({});
    const getUser = async () => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await axios.get(`${API_BASE_URL}/user/${params.id}`);
            if (response.status === 200) {
                if(params.id === currentUser._id){
                    setUser(response.data.user);
                    setReqUser(response.data.user);
                }
                else{
                  
                }
            } else {
                response.json({ error: 'Some error occurred while getting user\n' })
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    const [alltweets, setAllTweets] = useState([]);
    const getAllTweets = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/${params.id}/tweets/`);
            if (response.status === 200) {
                setAllTweets(response.data);
            } else {
                response.json({ error: 'Some error occurred while getting all posts\n' })
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        getUser();
        getAllTweets();
    }, []);

    return (
        <div className="container d-flex w-75">
            <Sidebar key={user._id} user={user} />
            <div className="my-profile-content w-75">
                <div className='top-section d-inline'>
                    <div className='d-flex background w-100' style={{ backgroundColor: '#1DA1F2', height: '6rem' }}>
                        <img src={requser?.profileImg} alt="User Profile" className="rounded-circle position-relative m-5 " width="100" height="100" />
                    </div>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div className='ms-3 w-50 d-inline-block'>
                            <h2 className="mt-5 mb-0">{requser?.fullName}</h2>
                            <p className="text-start">@{requser?.username}</p>
                        </div>
                        <div className='d-flex me-4' style={{}}>
                            <button className="btn btn-outline-dark ms-2">Edit User Profile</button>
                            <button className="btn btn-outline-dark ms-2">Change Profile Picture</button>
                        </div>
                    </div>
                    <div className='text-center'>
                        <hr />
                        <h5>Tweets and Replies</h5>
                    </div>
                    {/* List of tweets */}
                    <Tweet className='tweets mx-1'>
                        { alltweets?.map((tweets) => (
                            <TweetCard key={tweets._id} getAllTweets={getAllTweets} tweet={tweets} user={user} />
                        ))}
                    </Tweet>
                </div>
            </div>
        </div>
    );
}

export default Profile;