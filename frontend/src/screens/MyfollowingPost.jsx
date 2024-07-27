import React, {useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import { Link } from 'react-router-dom';
import '../css/Home.css'
function MyfollwingPost() {
  const naviagte=useNavigate();
  const [data,setData]=useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([])


  //toast function
  const notifyA=(msg)=>toast.error(msg)
  const notifyB=(msg)=>toast.success(msg)

  useEffect(()=>{
    const token=localStorage.getItem("jwt");
    if(!token)
    {
      naviagte("./signup");
    }

    

    // Fetching all posts
    fetch("https://instagram-clone-fui8.onrender.com/myfollowingpost",{
      headers:{
        Authorization:"Bearer "+localStorage.getItem("jwt")
      }
    })
    .then(res=>res.json())
    .then(result=>{
      console.log(result);
      setData(result)})
    .catch(err=>console.log(err))
  },[])

// to show and hide comments
  const toggleComment=(posts)=>{
    if(show){
      setShow(false)
      // console.log("hide");
    }
    else{
      setShow(true)
      setItem(posts)
      // console.log(item)
      // console.log("show");
    }
  }

  const likePost=(id)=>{
    fetch("https://instagram-clone-fui8.onrender.com/like",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    })
    .then(res=>res.json())
    .then((result)=>{
      const newData=data.map((posts)=>{
        if(posts._id==result._id)
        {
          return result
        }
        else
        {
          return posts
        }
      })
      setData(newData)
      console.log(result)
    })
  }

  const unlikePost=(id)=>{
    fetch("https://instagram-clone-fui8.onrender.com/unlike",{
      method:"put",
      headers:{
        "Content-Type":"application/json",
        Authorization:"Bearer "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        postId:id
      })
    })
    .then(res=>res.json())
    .then((result)=>{
      const newData=data.map((posts)=>{
        if(posts._id==result._id)
        {
          return result
        }
        else
        {
          return posts
        }
      })
      setData(newData);
      console.log(result)
    })
  }

  // function to make comment 
  const makeComment = (text, id) => {
    // Trim the comment text to remove leading/trailing whitespace
    const trimmedText = text.trim();
  
    // Check if the comment text is empty
    if (!trimmedText) {
      notifyB("Comment cannot be empty");
      return;
    }
  
    // Proceed with posting the comment if it is not empty
    fetch("https://instagram-clone-fui8.onrender.com/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text: trimmedText,
        postId: id
      })
    })
    .then(res => res.json())
    .then((result) => {
      // Update the comments section with the new comment
      const newData = data.map((posts) => {
        if (posts._id == result._id) {
          return result;
        } else {
          return posts;
        }
      });
  
      setData(newData);
      setComment("");
      notifyB("Comment posted");
      console.log(result);
    })
    .catch(error => {
      // Handle network or other errors
      notifyB("Failed to post comment. Please try again later.");
      console.error(error);
    });
  };
  return (
    <div className='home'>
      {/* Card */}
      {data.map((posts)=>{
        return(
          <div className="card">
        {/* card header */}
        <div className="card-header">
          <div className="card-pic">
            <img src="https://images.unsplash.com/photo-1490721742404-99d73e57700b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <h5>
            <Link to={`/profile/${posts.postedBy._id}`}>
            {posts.postedBy.name}
            </Link>
            </h5>
        </div>
        {/* card image & posts */}
        <div className="card-image">
          <img src={posts.photo} alt="" />
        </div>

        {/* card content */}
        <div className="card-content">
          {
            posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id)?(<span className="material-symbols-outlined material-symbols-outlined-red" onClick={()=>{unlikePost(posts._id)}}>
            favorite
            </span>):(<span className="material-symbols-outlined" onClick={()=>{likePost(posts._id)}}>
favorite
</span>)
          }
        

          <p>{posts.likes.length} Likes</p>
          <p>{posts.body}</p>
          <p style={{fontWeight:"bold",cursor:"pointer"}} onClick={()=>{toggleComment(posts)}}>view all comments</p>
        </div>

        {/* add comment */}
        <div className="add-comment">
        <span className="material-symbols-outlined">
mood
</span>
          <input type="text" placeholder='Add a comment' value={comment} onChange={(e)=>{setComment(e.target.value)}} />
          <button className='comment' onClick={()=>{makeComment(comment,posts._id)}}>Post</button>
        </div>
      </div>
        )
      })}
      {/* show comments */}
      {show && (
        <div className="showComment">
        <div className="container">
          <div className="postPic">
            <img src={item.photo}
 alt="" />
          </div>
          <div className="deatils">
          <div className="card-header" style={{borderBottom:"1px solid #00000029"}}>
          <div className="card-pic">
            <img src="https://images.unsplash.com/photo-1490721742404-99d73e57700b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <h5>{item.postedBy.name}</h5>
        </div>
        {/* comment section  */}
        <div className="comment-section" style={{borderBottom:"1px solid #00000029"}}>
          {item.comments.map((comment)=>{
            return (<p className='comm'>
            <span className='commenter' style={{fontWeight:"bolder"}}>{comment.postedBy.name}{" "} </span>
            <span className='commentText'>{comment.comment}</span>
          </p>)
          })}
          
        </div>
        <div className="card-content">
          
          <p>{item.likes.length} Likes</p>
          <p>{item.body}</p>
        </div>
        <div className="add-comment">
        <span className="material-symbols-outlined">
mood
</span>
          <input type="text" placeholder='Add a comment' value={comment} onChange={(e)=>{setComment(e.target.value)}} />
          <button className='comment' 
          onClick={()=>{makeComment(comment,item._id);
            toggleComment()
          }}
          >Post</button>
        </div>
          </div>
        </div>
        <div className="close-comment" onClick={()=>{toggleComment()}}>
        <span className="material-symbols-outlined material-symbols-outlined-comment">
close
</span>
        </div>
      </div>
      )

      }
    </div>
  )
}

export default MyfollwingPost