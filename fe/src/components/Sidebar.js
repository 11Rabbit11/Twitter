import { AiOutlineComment } from 'react-icons/ai';
import { NavLink } from 'react-router-dom'
import './Sidebar.css'


const Sidebar = (props) => {

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return (
    <div className="sidebar d-flex flex-column ">
      <div className="top d-flex flex-column my-1 ">
        {/* Links */}
        <AiOutlineComment className="my-3 mx-1" size={50} color="#1DA1F2" />
        <NavLink to='/home' className='link'><i class="fa-solid fa-house p-2 "></i>Home</NavLink>
        <NavLink to='/myprofile' className='link'><i class="fa-solid fa-user p-2 "></i>Profile</NavLink>
        <NavLink to='/login' onClick={logout} className='link'><i class="fa-solid fa-arrow-right-from-bracket p-2"></i>LogOut</NavLink>
      </div>
      <div className="user-info mt-auto">
        {/* Logged-in user's name and email */}
        <div className="d-flex align-items-center">
          <img src={props.user.profileImg} alt="User Profile" className="rounded-circle me-2" width="50" height="50" />
          <div>
            <h6 className="pt-3 mb-0">{props.user.fullName}</h6>
            <p className="text-muted">@{props.user.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;