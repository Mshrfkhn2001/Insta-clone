import React,{useState,useEffect} from 'react'
import '../css/CreatePost.css'
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const [body,setBody]=useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");
    const navigate=useNavigate();

    const notifyA=(msg)=>toast.error(msg)
    const notifyB=(msg)=>toast.success(msg)

    useEffect(()=>{
        //saving post to mongodb
        if(url)
        {
            fetch("https://instagram-clone-fui8.onrender.com/createPost",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    body,
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{if(data.error){
                notifyA(data.error)
            }
            else{
                notifyB("Successfully Posted")
                navigate("/")
            }
        })
            .catch(err=>console.log(err))
        }
        
    },[url])

    // Posting image to cloudanary
    const postDetails=()=>{
        console.log(body,image);
        const data=new FormData();
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","musharrafcloud")
        fetch("https://api.cloudinary.com/v1_1/musharrafcloud/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>setUrl(data.url))
        .catch(err=>console.log(err))


        
    }

    const loadfile=(event)=>{
        var output=document.getElementById('output');
        output.src=URL.createObjectURL(event.target.files[0]);
        output.onload=function(){
            URL.revokeObjectURL(output.src)
        };
    };

  return (
    <div className='createPost'>
        <div className="post-header">
            {/* header */}
            <h4 style={{margin:"3px auto"}}>Create New Post</h4>
            <button id='post-btn' onClick={()=>{postDetails()}}>Share</button>
        </div>

        {/* image preview */}
        <div className="main-div">
            <img id='output' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACUCAMAAADWBFkUAAAAY1BMVEX///8AAADq6upNTU2MjIyamprm5ubGxsafn58SEhLBwcEsLCzU1NT5+fl+fn4oKChCQkK1tbUaGhre3t4JCQk4ODhxcXFUVFQgICC7u7unp6fz8/NoaGiUlJQzMzN4eHhcXFwe26ryAAAEKklEQVR4nO3cYXuqIBQH8EizOTUtmjprq+//Ke+qbRgcEPCA7D783/bc9nu4B8MDulrFxMTExCwSut81RxJC3tqhrNTWtF4aOU7ebhXYl6V5YnYnifW0W5oGpctg7WVpGJwOLN6PpVmynAFuGcaVAMpewFaB1sE9f2logcEdlhapcua1HfusbtMAcmmYqFlzWvZRX8IXON9ZJ7+kgicx7W4RG5D3X9KB/wFm2pdFaEC2v6T8lfsoamcmat0lat1llra6xbVwHHtt9vpybYqiaYet7NYDPbbadTr60e42Xqy22hN/V3Hce6kIKy3tiJDWB9dGm4EdhjO/hgtDSz8hLCFX95PNQpsA0nvcLyzNtakMS8h7cFqay7Wd61ow1iqGlhD+K5bWyqbYI0lg2i1gHMVxKZhqlYXgvBRMtcCv2DgfxoBB1T2eq51olLfGWFIbNCtMtWosuRpiN7d/pM9F1grtKXUe+wSFdjGYat/U2osR9qcvmOuOrqm2VWsHEyxbJB81R9dUO9EmpQbY8VcJTTgcbanWGmA3z/9Si2uqPZ1V2NQaS3qdYjBe1ai2+4761yKxonSaxObr20b4OxZDC+5tTY+uuVaxrtG+M4P/g+pJrsWdDl9xBmMz9Q1TxWChrSRblOKOmyTydZxgmK9drcC9am2sap5OXBnsejX7gv8zjfblYGKFrORa9sHo8/DmG+0JNoElvaoYrHuMWdr/fFwMkgMDQKa35VVrhjn92+x9+NiY9UOnRvYe+ej67Y3rHXiQF4NXrdbI3iIrBp9a/UM6uaRH5VFrcu4lh0fXn9bw+BNYu9602jX7nR4qBl9aUywB+6uetFan4MSVhx+t3cGygzC6eFr5nk5lfb6Q56JpaStd2Ngfhsy5YsDS0oQkkgWDxQRjeR5dJO29Zf4Jju7MY6ZPo4ujpY8b4Q7gzhrZrxzGXBRt+dPLE0bXfoKxjLgYWsruexKOi3Fws2bNNQQtHfdDnqfa3DK4Z9TRm68tn+8ocza61UT7dAGtsIHGigHp0DmithTbYm8PLsYEQ9aW0B7P5/0WGKcMMLUUbjjeigHv2QMsbSm0bL5zzBDPnCNpqXyr74CHRdICE8xJULTgBAtVK63ZELVbb1gEbdkDXxuqtlSeVwlMu8W8QLnWll6xM7UeJ9h8rd8ymKn19qOAoX1VHAwMT7vAE3IztP6xURu1URu1URu1URu1/4m2ttc2ifdc7fcdMv9ZV9baZRO17hK17hK17qKlDeYtJUyreEuJyUNVLpOxp4SEh09GD74V6SaEqN6uE+Br11iu/LjTkN8KJRwVQzpe4CZiUQf8yi3ocYU/9aa4YGuhhs/JVSjHeLDTSJ8CCPAyJn175Feys8dN0un03cTvKh12587/zSOQ626jswY4rYOIt7f4xMTExMTExMT4zj9WFl2n3jnLsQAAAABJRU5ErkJggg=='/>
            <input type="file" accept='image/*' onChange={(event)=>{loadfile(event)
                setImage(event.target.files[0])
            }}/>
        </div>

        {/* details */}
        <div className="details">
            <div className="card-header">
                <div className="card-pic">
                    <img src="https://images.unsplash.com/photo-1490721742404-99d73e57700b?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                </div>
                <h5>Tabish</h5>
            </div>
            <textarea value={body} onChange={(e)=>{
                setBody(e.target.value)
            }} type="text" placeholder='Write a caption'></textarea>
        </div>
    </div>
  )
}

export default CreatePost