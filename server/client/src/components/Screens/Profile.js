import React,{useEffect,useState,useContext} from "react";
import {UserContext} from "../../App";
const Profile=()=>{
    const [MyPics,setMyPics]=useState([]);
    const {state,dispatch}=useContext(UserContext);
    const [image,setImage]=useState('');
    useEffect(()=>{
        fetch("/mypost",{
         headers:{
             "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
        }).then(res=>res.json())
        .then(data=>{
            setMyPics(data.post);
        }).catch(error=>{
            console.log(error);
        })
     },[])
     useEffect(()=>{
       if(image)
       {
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
           fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               window.location.reload()
           })
       
        })
        .catch(err=>{
            console.log(err)
        })
       }
     },[image])
     const updatepic=(file)=>{
         setImage(file);
     }
    return (
        <div style={{maxWidth:"400px",margin:"0px auto"}}>
        <div style={{
            maxWidth:"400px",
            display:"inline-block",
           margin:"0px auto",
            borderBottom:"1px solid grey"
        }}>
        <div style={{display:"flex",justifyContent:"space-around",marginTop:"10px"  }}>
                 <div>
                <img alt="" style={{marginLeft:"3px",width:"110px",height:"110px",borderRadius:"80px"}}
                   src={state?state.pic:"loading"}
                />
                </div>
                <div style={{marginLeft:"18px"}}>
               <h5>{state?state.name:"loading"}</h5>
               <h6>{state?state.email:"loading"}</h6>
               <div style={{display:"flex",justifyContent:"space-between",width:"105%"}}>
                      <h6 style={{justifyContent:"center"}}>{MyPics.length} posts</h6>
                      <h6 >{state?state.followers.length:"0"} followers</h6>
                      <h6 >{state?state.following.length:"0"} following</h6>
                  </div>
                 
                </div>
            </div>
            <div style={{margin:"10px"}} className="file-field input-field">
              <div className="btn">
                 <span>Upload pic</span>
                   <input type="file" onChange={e=>updatepic(e.target.files[0])}/>
              </div>
                   <div className="file-path-wrapper">
                      <input className="file-path validate" type="text" />
                   </div>
                </div>
                  </div>  
                 <div className="gallerypics">
                     {
                         MyPics.map(item=>{
                             return(
                            <img key={item._id} className="pic"  src={item.photo} alt={item.title}/>
                             )
                         })
                     }
                 </div>
        </div>
    )
}
export default Profile;