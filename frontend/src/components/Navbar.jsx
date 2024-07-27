import React, { useContext } from 'react';
import logo from "../image/logo.png";
import '../css/Navbar.css';
import { Link } from 'react-router-dom';
import { LoginContext } from '../Context/LoginContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const { setModalOpen } = useContext(LoginContext);
  const token = localStorage.getItem("jwt");

  const loginStatus = () => {
    if (token) {
      return (
        <>
          <Link to="/profile"><li>Profile</li></Link>
          <Link to="/createPost">Create Post</Link>
          <Link to="/followingpost" style={{ marginLeft: "20px" }}>My Following Post</Link>
          <Link to={""}>
            <button className='primaryBtn' onClick={() => setModalOpen(true)}>Log Out</button>
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signup"><li>SignUp</li></Link>
          <Link to="/signin"><li>SignIn</li></Link>
        </>
      );
    }
  };

  const loginStatusMobile = () => {
    if (token) {
      return (
        <>
          <Link to="/"><li><span className="material-symbols-outlined">home</span></li></Link>
          <Link to="/profile"><li><span className="material-symbols-outlined">account_circle</span></li></Link>
          <Link to="/createPost"><li><span className="material-symbols-outlined">add_box</span></li></Link>
          <Link to="/followingpost" style={{ marginLeft: "20px" }}><li><span className="material-symbols-outlined">explore</span></li></Link>
          <Link to={""}><li onClick={() => setModalOpen(true)}><span className="material-symbols-outlined">logout</span></li></Link>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signup"><li>SignUp</li></Link>
          <Link to="/signin"><li>SignIn</li></Link>
        </>
      );
    }
  };

  return (
    <div className={`navbar ${token ? 'navbar-logged-in' : 'navbar-logged-out'}`}>
      <img id='insta-logo' src={logo} alt="" onClick={() => { navigate("/") }} />
      <ul className='nav-menu'>
        {loginStatus()}
      </ul>
      <ul className='nav-mobile'>
        {loginStatusMobile()}
      </ul>
    </div>
  );
}

export default Navbar;
