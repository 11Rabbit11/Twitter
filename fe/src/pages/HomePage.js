import './HomePage.css';
import Sidebar from "../components/Sidebar";
import TweetCard from '../components/TweetCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Right = styled.div`
  overflow-y: auto;
  height: 88vh;
`;

const HomePage = () => {

  const [userSB, setUserSB] = useState({});
  const [show, setShow] = useState(false);
  const [image, setImage] = useState({ preview: '', data: '' });

  const handleClose = () => {
    setImage({ preview: '', data: '' });
    setContent('');
    setShow(false);
  };

  const handleShow = () => setShow(true);

  const [content, setContent] = useState('');

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      const img = {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0]
      }
      setImage(img);
      console.log(img);
    }
  }

  //Handle Add Tweet
  const addTweet = async () => {
    try {
      if (content === '') {
        toast.error('Please enter some content');
      } else {
        const formData = new FormData();
        formData.append('content', content);
        if (image.data) {
          formData.append('file', image.data);
        }
        const response = await axios.post(
          `${API_BASE_URL}/tweet/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }
        );
        handleClose();
        if (response.status === 201) {
          toast.success('Tweet posted successfully', { autoClose: 2300 });
          getAllTweets();
        } else {
          toast.error('Some error occurred while posting tweet', { autoClose: 2300 });
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  //Get User from local storage
  const getUser = async () => {
    const currentUser = (JSON.parse(localStorage.getItem('user')));
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${currentUser._id}`);
      if (response.status === 200) {
        setUserSB(response.data.user);
      } else {
        response.json({ error: 'Some error occurred while getting user\n' })
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  //Get All Tweets
  const [alltweets, setAllTweets] = useState([]);
  const getAllTweets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tweet/`);
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
    getAllTweets();
    getUser();
  }, []);

  return (
    <div className="container home-page d-flex w-75">
      {/* Sidebar */}
      <Sidebar />
      <div className="tweet-list w-75">
        <div className="top d-flex align-items-center justify-content-between my-4 mx-2 px-1">
          <h3>Home  </h3>
          <button className="tweet-btn btn btn-secondary px-5" onClick={handleShow}>Tweet</button>
        </div>

        {/* List of tweets */}
        <Right className='tweets mx-1'>
          {alltweets.map((tweets) => (
            <TweetCard userSB={tweets} key={tweets._id} getTweets={getAllTweets} tweet={tweets} />
          ))}
        </Right>
      </div>

      {/* Modal here */}
      <Modal show={show} onClose={handleClose} title="New Tweet">
        {/* Modal content */}
        <div className=''>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's happening?" rows="4" className="form-control mb-3"></textarea>
          <div className='row'>
            <label className=" ">
              <input className=' mb-1' name='file' type="file" accept="image/*" onChange={handleFileSelect} />
              {image.preview ? <img src={image.preview} alt='' width='auto' height='180' position-absolute style={{ opacity: 0.6 }} />
                : '.'}
            </label>
            <button className="btn btn-primary col-3 ms-auto me-2" onClick={addTweet}>Tweet</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default HomePage;
