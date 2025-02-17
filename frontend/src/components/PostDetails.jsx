import React from 'react'
import "../css/PostDetails.css"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
function PostDetails({item,toggleDetails}) {

    const navigate=useNavigate();
    //toast function
  const notifyA=(msg)=>toast.error(msg)
  const notifyB=(msg)=>toast.success(msg)
    const removePost=(postId)=>{
        // console.log(postId)
        if(window.confirm("Do you really want to delete this post ?"))
        {
            fetch(`https://instagram-clone-fui8.onrender.com/deletePost/${postId}`,{
                method:"delete",
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("jwt")
                },
            })
            .then((res)=>res.json())
            .then((result)=>{
                console.log(result)
                toggleDetails();
                navigate("/")
                notifyB(result.message);
            })
        }
    }

  return (
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
          <div className="deletePost" onClick={()=>{removePost(item._id)}}>
          <span className="material-symbols-outlined">
delete
</span>
          </div>
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
          <input type="text" placeholder='Add a comment' 
        //   value={comment} 
        //   onChange={(e)=>{setComment(e.target.value)}} 
          />
          <button className='comment' 
        //   onClick={()=>{makeComment(comment,item._id);
        //     toggleComment()
        //   }}
          >Post</button>
        </div>
          </div>
        </div>
        <div className="close-comment" 
        onClick={()=>{toggleDetails()}}
            >
        <span className="material-symbols-outlined material-symbols-outlined-comment">
close
</span>
        </div>
      </div>
  )
}

export default PostDetails