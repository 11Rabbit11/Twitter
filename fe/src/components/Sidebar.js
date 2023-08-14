import { AiOutlineComment } from 'react-icons/ai';
import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'

//Style Componenet
const StyledNavLink = styled(NavLink)`
  color: #000; /* Default color */
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius:20px;
  width: 75%;

  &:hover {
  background-color: #f0f0f0;
  }

  &.active {
  background-color: #289feed4;
  color: white;
  
  }

  i {
  margin-right: 0.2rem;
  }
`;

const Sidebar = (props) => {

  const [userSB, setUserSB] = useState({});
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const getUser = async () => {
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
    getUser();
  }, [currentUser._id]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.info('Logged Out Successfully', {
      autoClose: 2200, //
    });
  }

  return (
    <div className="sidebar d-flex flex-column ">
      <div className="top d-flex flex-column my-1 ">
        {/* Links */}
        <AiOutlineComment className="my-3 mx-1" size={50} color="#1DA1F2" />
        <StyledNavLink to='/home' className='ps-2 link' activeclassname='active'><i class="fa-solid fa-house p-2 "></i>Home</StyledNavLink>
        <StyledNavLink to={`/profile/${userSB._id}`} className='ps-2 link' activeclassname='active'><i class="fa-solid fa-user p-2 "></i>Profile</StyledNavLink>
        <StyledNavLink to='/login' onClick={logout} className='ps-2 link'><i class="fa-solid fa-arrow-right-from-bracket p-2"></i>LogOut</StyledNavLink>
      </div>
      <div className="user-info mt-auto">
        {/* Logged-in user's name and email */}
        <div className="d-flex align-items-center">
          <img src={userSB.profileImg} alt="User Profile" className="rounded-circle me-2" width="50" height="50" />
          <div>
            <h5 className="pt-3 mb-0">{userSB.fullName}</h5>
            <p className="text-muted">@{userSB.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;