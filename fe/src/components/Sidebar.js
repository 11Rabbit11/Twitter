import { AiOutlineComment } from 'react-icons/ai';
import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import styled from 'styled-components';
import { toast } from 'react-toastify';

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
        <StyledNavLink to= {`/profile/${props.user._id}`} className='ps-2 link' activeclassname='active'><i class="fa-solid fa-user p-2 "></i>Profile</StyledNavLink>
        <StyledNavLink to='/login' onClick={logout} className='ps-2 link'><i class="fa-solid fa-arrow-right-from-bracket p-2"></i>LogOut</StyledNavLink>
      </div>
      <div className="user-info mt-auto">
        {/* Logged-in user's name and email */}
        <div className="d-flex align-items-center">
          <img src={props.user.profileImg} alt="User Profile" className="rounded-circle me-2" width="50" height="50" />
          <div>
            <h5 className="pt-3 mb-0">{props.user.fullName}</h5>
            <p className="text-muted">@{props.user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;