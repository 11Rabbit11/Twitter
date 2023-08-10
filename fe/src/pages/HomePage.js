import './HomePage.css';
import Sidebar from "../components/Sidebar";
import TweetCard from '../components/TweetCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import Modal from '../components/Modal';

const HomePage = () => {

  const [user, setUser] = useState({});

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      <Sidebar key={user._id} user={user} />
      <div className="tweet-list w-75">
        <div className="top d-flex align-items-center justify-content-between my-4 mx-2 px-1">
          <h3>Home  </h3>
          <button className="tweet-btn btn btn-secondary px-5" onClick={handleShow}>Tweet</button>
        </div>
        {/* List of tweets */}
        <div className='tweets mx-1'>
          {alltweets.map((tweets) => (
            <TweetCard key={tweets._id} getAllTweets={getAllTweets} tweet={tweets} user={user} />
          ))}
        </div>
      </div>

      {/* Modal here */}
      <Modal show={show} onClose={handleClose}>
        {/* Modal content */}
        <div className=''>
          <textarea placeholder="What's happening?" rows="4" className="form-control mb-3"></textarea>
          <div className='grid'>
            <label className="col-4 btn btn-outline-primary me-4">
              Upload Image
              <input className='ms-2' type="file" accept="image/*" hidden />
            </label>
            <button className="btn btn-primary col-3 ms-auto">Tweet</button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default HomePage;
