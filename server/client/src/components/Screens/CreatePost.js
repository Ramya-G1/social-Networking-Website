import React,{useState,useEffect} from "react";
import {useHistory} from "react-router-dom";
import M from "materialize-css";
const CreatePost=()=>{
    const history=useHistory();
    const [title,setTitle]=useState('');
    const [body,setBody]=useState('');
    const [image,setImage]=useState('');
    const [url,setUrl]=useState('')
    useEffect(()=>{
        if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
          console.log(data);
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
               history.push('/')
           }
        }).catch(err=>{
            console.log(err)
        })
    }
    },[url])
    const postDetails=()=>{
        const data=new FormData();
        data.append("file",image);
        data.append("upload_preset","socialmdeia");
        data.append("cloud_name","dwa4ixyyh");
        fetch("https://api.cloudinary.com/v1_1/dwa4ixyyh/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
        })
        .catch(err=>{
            console.log(err);
        })
    }
    return(
        <div className="card input-field" 
        style={{margin:"40px auto",maxWidth:"450px",padding:"20px",textAlign:"center"}}
        >
            <h2>Create Post</h2>
         <input type="text" placeholder="Text" 
         value={title}
         onChange={e=>setTitle(e.target.value)}
         />
         <input type="text" placeholder="Body"
         value={body}
         onChange={e=>setBody(e.target.value)}
         />
         <div className="file-field input-field">
              <div className="btn">
                 <span>Upload Image</span>
                   <input type="file" onChange={e=>setImage(e.target.files[0])}/>
              </div>
                   <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                   </div>
        </div>
        <button className="btn waves-effect waves-light" onClick={()=>postDetails()} >Submit Post
        </button>
        </div>
    )
}
export default CreatePost;