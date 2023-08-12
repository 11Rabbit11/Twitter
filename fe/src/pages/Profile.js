import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import TweetCard from '../components/TweetCard';

const Profile = () => {

    const [user, setUser] = useState({});
    const getUser = async () => {
        const currentUser = (JSON.parse(localStorage.getItem('user')));
        try {
            const response = await axios.get(`${API_BASE_URL}/user/${currentUser._id}`);
            if (response.status === 200) {
                setUser(response.data.user);
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
            const response = await axios.get(`${API_BASE_URL}/user/${user._id}/tweets/`);
            if (response.status === 200) {
                setAllTweets(response.data.tweets);
            } else {
                response.json({ error: 'Some error occurred while getting all posts\n' })
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    useEffect(() => { 
        getAllTweets()
        getUser(); 
    });

    return (
        <div className="container d-flex w-75">
            <Sidebar key={user._id} user={user} />
            <div className="my-profile-content w-75">
                <div className="container text-center py-5" style={{ backgroundColor: '#1DA1F2', minHeight: '25vh' }}>
                    <div className="d-flex align-items-start mt-4">
                        <div className="d-flex align-items-center mt-4 position-absolute w-50" >
                            <div className='ms-1'>
                                <img src={user.profileImg} alt="User Profile" className="rounded-circle me-2 mb-2" width="100" height="100" />
                                <h2 className="mb-0">{user.fullName}</h2>
                                <p className="text-start">@{user.username}</p>
                            </div>
                            <div className='btn-group mb-5' style={{ marginLeft: '16rem' }}>
                                <button className="btn btn-outline-dark ms-2">Edit User Profile</button>
                                <button className="btn btn-outline-dark ms-2">Change Profile Picture</button>
                            </div>
                        </div>
                        <div className='tweets'>
                            
                        </div>
                    </div>
                </div>

                <div className='container tweets mx-1'>
                    {alltweets ? alltweets.map((tweets) => (
                        <TweetCard key={tweets._id} getAllTweets={'getAllTweets'} tweet={tweets} user={user} />
                    )) : "NO TWEETS YET"}
                </div>
            </div>
        </div>
    );
}

export default Profile;