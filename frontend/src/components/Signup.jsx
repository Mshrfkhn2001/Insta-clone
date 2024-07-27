import React, {useEffect,useState,useContext} from 'react'
import logo from "../image/logo.png"
import '../css/Signup.css'
import { Link ,useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { LoginContext } from '../Context/LoginContext';
function Signup() {
    const {setUserLogin}=useContext(LoginContext)
    const navigate=useNavigate()
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [userName,setuserName]=useState("");
    const [password,setPassword]=useState("");

    //toast function
    const notifyA=(msg)=>toast.error(msg)
    const notifyB=(msg)=>toast.success(msg)

    const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    const postData=()=>{
        //checking email validation
        if(!emailRegex.test(email))
        {
            notifyA("Invalid email");
            return;
        }
        else if(!passRegex.test(password))
        {
            notifyA("Password must contain 8 characters, including atleast 1 number and includes both lower and uppercase letter and special characters for example #,@,?")
            return 
        }
        //sending data to server
         fetch("https://instagram-clone-fui8.onrender.com/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                userName:userName,
                email:email,
                password:password
            })
         }).then(res=>res.json())
         .then(data=>{
            if(data.error)
            notifyA(data.error)
        else
        {
            notifyB(data.message)
            navigate("/signin")
        }
            console.log(data)
        })
    }

    const continueWithGoogle=(credentialResponse)=>{
        console.log(credentialResponse);
    const jwtDetail=jwtDecode(credentialResponse.credential)
    console.log(jwtDetail)
    fetch("https://instagram-clone-fui8.onrender.com/googleLogin",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            name:jwtDetail.name,
            userName:jwtDetail.name,
            email:jwtDetail.email,
            email_verified:jwtDetail.email_verified,
            clientId:credentialResponse.clientId,
            Photo:jwtDetail.picture
        })
     }).then(res=>res.json())
     .then(data=>{
        if(data.error)
            notifyA(data.error)
        else
        {
            notifyB("Signed in Successfully")
            console.log(data)
            localStorage.setItem("jwt",data.token)
            localStorage.setItem("user",JSON.stringify(data.user))
            setUserLogin(true)
            navigate("/")
        }
            console.log(data)
    })
    }

  return (
    <div className='signUp'>
        <div className="form-container">
            <div className="form">
            <img className='signUpLogo' src={logo} alt="" />
            <p className='loginPara'>
                Sign up to see photos and videos <br /> from your friends
            </p>
            <div>
                <input type="email" name='email' value={email} id='email' placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}}/>
            </div>
            <div>
                <input type="text" name='name' value={name} id='name' placeholder='Full Name' onChange={(e)=>{setName(e.target.value)}}/>
            </div>
            <div>
                <input type="text" name='username' value={userName} id='username' placeholder='Username' onChange={(e)=>{setuserName(e.target.value)}}/>
            </div>
            <div>
                <input type="password" name='password' value={password} id='password' placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}/>
            </div>
            <p className='loginPara' style={{fontSize:"12px",margin:"3px 0px"}}>By signing up you agree to our terms, <br />
            privacy policy and cookies policy.</p>
            <input type="submit" id='submit-btn' value="Sign Up" onClick={()=>{postData()}}/>
            <hr style={{width:"80%"}} />
            <GoogleLogin
  onSuccess={credentialResponse => {
    continueWithGoogle(credentialResponse)
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>
            </div>
            <div className='form2'>
                Already have an account ?
                <Link to="/signin">
                <span style={{color:"blue",cursor:"pointer"}}>Sign In</span>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Signup