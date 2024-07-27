import logo from './logo.svg';
import React,{createContext,useState} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter,Routes,Route} from "react-router-dom" 
import Home from './screens/Home';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Profile from './screens/Profile';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './screens/CreatePost';
import { LoginContext } from './Context/LoginContext';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import MyfollwingPost from './screens/MyfollowingPost';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  const [userLogin,setUserLogin]=useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <BrowserRouter>
    <div className="App">
    <GoogleOAuthProvider clientId="1039175249263-p3ova6kiriu74nn4vt3m2797fm9l6mr8.apps.googleusercontent.com">
      <LoginContext.Provider value={{setUserLogin,setModalOpen}}>
      <Navbar login={userLogin}/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route path='/profile/:userid' element={<UserProfile/>}></Route>
        <Route exact path='/profile' element={<Profile/>}></Route>
        <Route path='/createPost' element={<CreatePost/>}></Route>
        <Route path='/followingpost' element={<MyfollwingPost/>}></Route>
        
      </Routes>
      <ToastContainer theme='dark'/>
      {/* <Modal></Modal> */}
      {modalOpen && <Modal setModalOpen={setModalOpen}></Modal>}
      </LoginContext.Provider>
      </GoogleOAuthProvider>
      
    </div>
    </BrowserRouter>
  );
}

export default App;
