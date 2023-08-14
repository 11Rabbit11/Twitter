import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'
import TweetCard from '../components/TweetCard';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Modal from 'react-bootstrap/Modal';

const Tweet = styled.div`
  overflow-y: auto;
  height: 65vh;
`;

const Profile = () => {

    const [showEdit, setEditShow] = useState(false);
    const [showEditPic, setPicShow] = useState(false);

    const handleEditClose = () => {
        setEditShow(false);
        setName('');
        setLocation('');
        setDob('');
    };
    const handlePicClose = () => {
        setPicShow(false);
        setImage({ preview: '', data: '' });
    }
    const handleEditShow = () => setEditShow(true);
    const handlePicShow = () => setPicShow(true);

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [dob, setDob] = useState('');
    const [image, setImage] = useState({ preview: '', data: '' });

    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            const img = {
                preview: URL.createObjectURL(e.target.files[0]),
                data: e.target.files[0]
            }
            setImage(img);
        }
    }

    const params = useParams();
    const [user, setUser] = useState({});
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const [followstatus, setFollowStatus] = useState(false);
    const [alltweets, setAllTweets] = useState([]);

    const CONFIG_OBJ = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

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

    const followUnfollow = async (id, type) => {
        const request = { "id": id };
        try {
            const response = await axios.put(`${API_BASE_URL}/user/${request.id}/${type}`, request, CONFIG_OBJ);
            if (response.status === 200) {
                setFollowStatus(!followstatus);
                getAllTweets();
                (type === 'follow' ? toast.success('Followed Successfully', { autoClose: 2100 }) : toast.success('Unfollowed Successfully', { autoClose: 2100 }));
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    const editProfile = async () => {
        try {
            const updatedProfile = {};
            console.log(name);
            updatedProfile.name = name || user.fullName;
            if (location) {
                updatedProfile.location = location;
            }
            if (dob) {
                updatedProfile.dob = dob;
            }
            const response = await axios.put( `${API_BASE_URL}/user/${user._id}`, updatedProfile, CONFIG_OBJ);
            if (response.status === 200) {
                console.log('Profile updated successfully');
                toast.success('Profile updated successfully', { autoClose: 2100 });
                handleEditClose(); // Close the modal after updating
                setUser(response.data.user);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            toast.error('Some error occurred while updating profile', { autoClose: 2100 });
        }
    };

    const addProfilePic = async () => {
        try {
            if (image === '') {
                toast.error('Please enter some content');
            } else {
                const formData = new FormData();
                if (image.data) {
                    formData.append('image', image.data);
                }
                const response = await axios.post(
                    `${API_BASE_URL}/user/${params.id}/uploadProfilePic`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }
                );
                handlePicClose();
                if (response.status === 200) {
                    console.log(response.data);
                    toast.success('Profile Pic Updated Successfully', { autoClose: 2300 });
                    setUser(response.data.user);
                    getAllTweets();
                    window.location.reload();
                } else {
                    toast.error('Some error occurred' + response.data, { autoClose: 2300 });
                }
            }
        } catch (error) {
            console.log(error.response.data);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/user/${params.id}`);
                if (response.status === 200) {
                    setUser(response.data.user);
                } else {
                    response.json({ error: 'Some error occurred while getting user\n' })
                }
                //Check if the current user's ID is present in followers array
                const isFollowedByCurrentUser = response.data.user?.followers?.some(follower => {
                    return (follower._id === currentUser._id)
                });
                setFollowStatus(isFollowedByCurrentUser);
            } catch (error) {
                console.log(error.response.data);
            }
        }
        getUser();
        getAllTweets();
    }, [currentUser._id, params, user, followstatus]);

    return (
        <div className="container d-flex w-75">
            <Sidebar />
            <div className="my-profile-content w-75">
                <div className='top-section d-inline'>
                    <div className='d-flex background w-100' style={{ backgroundColor: '#1DA1F2', height: '6rem' }}>
                        <img src={(user?.profileImg) ? IMAGE_BASE_URL + user?.profileImg : 'https://images.unsplash.com/photo-1578309992775-ca77477765ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNlbGVjdCUyMGltYWdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'} alt="User Profile" className="rounded-circle position-relative m-4 mt-5 " width="100" height="100" />
                    </div>
                    <div className='d-flex align-items-center justify-content-between'>
                        <div className='ms-3 w-50 d-inline-block'>
                            <h2 className="mt-5 mb-0">{user?.fullName}</h2>
                            <p className="text-start">@{user?.username}</p>
                            <div className="personal-details d-flex align-items-center m-2">
                                <i class="fa-solid fa-cake-candles ms-3 me-2"></i>
                                <span className=''>{user?.dateOfBirth ? user?.dateOfBirth : 'D.O.B'}</span>
                                <i class="fa-solid fa-location-dot ms-3 me-2"></i>
                                <span className=''>{user?.location ? user?.location : 'Location'}</span>
                            </div>
                            <div className="last-used d-flex m-2 align-items-center">
                                <i class="fa-solid fa-calendar-days ms-3 me-2"></i>
                                <span>Last Used</span>
                            </div>
                            <div className='d-flex mt-4 align-items-center'>
                                <span className='mx-2'><h5>{user?.followers?.length} Followers</h5></span>
                                <span className='mx-2'><h5>{user?.following?.length} Following</h5></span>
                            </div>
                        </div>
                        <div className='d-flex me-4'> {/* Edit Profile And Follow */}
                            {(currentUser?._id === user?._id) ? <>
                                <button className="btn btn-outline-dark ms-2" onClick={handleEditShow}>Edit User Profile</button>
                                <button className="btn btn-outline-dark ms-2" onClick={handlePicShow}>Change Profile Picture</button>
                            </> : followstatus ? <button onClick={() => { followUnfollow(user?._id, 'unfollow') }} className="btn btn-dark mx-2 mb-5">Unfollow</button>
                                : <button onClick={() => { followUnfollow(user?._id, 'follow') }} className="btn btn-outline-dark mx-2 mb-5">Follow</button>}
                        </div>
                    </div>
                    <div className='text-center'>
                        <hr />
                        <h5>Tweets and Replies</h5>
                    </div>
                    {/* List of tweets */}
                    <Tweet className='tweets mx-1'>
                        {alltweets?.map((tweets) => (
                            <TweetCard key={tweets._id} getTweets={getAllTweets} user={user} tweet={tweets} />
                        ))}
                    </Tweet>
                </div>

                <Modal show={showEdit} onHide={handleEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location:</label>
                            <input
                                type="text"
                                id="location"
                                className="form-control"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth:</label>
                            {/* You can use a date picker or calendar component here */}
                            <input
                                type="date"
                                id="dob"
                                className="form-control"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={handleEditClose}>Close</button>
                        <button className="btn btn-primary" onClick={editProfile}>Post</button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEditPic} onHide={handlePicClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Profile Pic</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="file" onChange={handleFileSelect} />
                        {image.preview ? <img src={image.preview} alt='' width='auto' height='280' position-absolute style={{ opacity: 0.8, marginTop: '10px' }} />
                            : ''}
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={handlePicClose}>Close</button>
                        <button className="btn btn-primary" onClick={addProfilePic}>Post</button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Profile;