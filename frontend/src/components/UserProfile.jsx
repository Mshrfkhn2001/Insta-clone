import React,{useEffect,useState} from 'react'
import '../css/Profile.css'
import PostDetails from './PostDetails'
import { useParams } from 'react-router-dom'
function UserProfile() {
const {userid}=useParams()
const [user, setUser] = useState("")
const [posts, setPosts] = useState([])
const [isFollow, setIsFollow] = useState(false)

//to follow user
var picLink="https://cdn-icons-png.flaticon.com/128/3177/3177440.png" 
  const followUser=(userId)=>{
    
    fetch("https://instagram-clone-fui8.onrender.com/follow",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        followId:userId
      })
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data)
      setIsFollow(true)
    })
  }
//to follow user
const unfollowUser=(userId)=>{
  fetch("https://instagram-clone-fui8.onrender.com/unfollow",{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      followId:userId
    })
  })
  .then((res)=>res.json())
  .then((data)=>{
    console.log(data)
    setIsFollow(false)
  })
}
  useEffect(() => {
    fetch(`https://instagram-clone-fui8.onrender.com/user/${userid}`,{
      headers:{
        Authorization:"Bearer "+localStorage.getItem("jwt")
      }
    })
    .then(res=>res.json())
    .then((result)=>{
        console.log(result)
      setUser(result.user)
      setPosts(result.posts)
      if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id))
      {
        setIsFollow(true)
      }
    })
  }, [isFollow])
  
  return (
    <div className='profile'>
      {/* Profile frame */}
      <div className="profile-frame">

        {/* profile pic */}
        <div className="profile-pic">
          <img src={user.photo?user.photo:picLink} alt="" />
        </div>

        {/* profile data */}
        <div className="profile-data">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <h1>{user.name}</h1>
          <button className='followBtn'
          onClick={()=>{
            if(isFollow)
            {
              unfollowUser(user._id)
            }
            else
            {
              followUser(user._id)
            }
            }}
          >
            {isFollow?"Unfollow":"Follow"}
            </button>
          </div>
          
          <div className="profile-info" style={{display:"flex"}}>
            <p>{posts.length} post</p>
            <p>{user.followers?user.followers.length:"0"} followers</p>
            <p>{user.following?user.following.length:"0"} following</p>
          </div>
        </div>

      </div>
      <hr style={{
        width:"90%",
        margin:"auto",
        opacity:"0.8",
        margin:"25px auto",
      }} />
      {/* Gallery */}
      <div className="gallery">
        {
          posts.map((pics)=>{
            return <img key={pics._id} src={pics.photo} className='item' 
            // onClick={(=>{
            //   toggleDetails(pics)
            // })}
            // onClick={()=>{
            //   toggleDetails(pics)
            // }}
            ></img>
          })
        }
      </div>
      {/* {show && <PostDetails item={posts} toggleDetails={toggleDetails} />} */}
    </div>
  )
}

export default UserProfile;