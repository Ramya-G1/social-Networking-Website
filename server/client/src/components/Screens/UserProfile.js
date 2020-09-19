import React,{useEffect,useState,useContext} from "react";
import {UserContext} from "../../App";
import {useParams} from 'react-router-dom'
const Profile=()=>{
    const [profileDetails,setProfileDetails]=useState();
    const {state,dispatch}=useContext(UserContext);
    const {userid} = useParams();
    const [showfollow,setShowFollow] = useState(state? !state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
         headers:{
             "Authorization":"Bearer "+localStorage.getItem("jwt")
         },
        }).then(res=>res.json())
        .then(data=>{
            setProfileDetails(data);
        }).catch(error=>{
            console.log(error);
        })
     },[])
     const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfileDetails((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfileDetails((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }
    return (
      
        <>
        {profileDetails? 
         
        <div style={{margin:"10px auto",maxWidth:"500px"}}>
        <div style={{display:"flex",justifyContent:"space-around", margin:"180x 0px",borderBottom:"1px solid grey"  }}>
                 <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
               src={profileDetails.user.pic}
                />
                  </div>
               <div>
                 <h5>{profileDetails.user.name}</h5>
                 <h6>{profileDetails.user.email}</h6>
                  <div style={{display:"flex",justifyContent:"space-between",width:"105%"}}>
                      <h6>{profileDetails.posts.length} posts</h6>
                      <h6>{profileDetails.user.followers.length} followers</h6>
                      <h6>{profileDetails.user.following.length} following</h6>
                  </div>
                  {showfollow?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
                </div>
            </div>
            <div className="gallerypics">
                     {
                         profileDetails.posts.map(item=>{
                             return(
                            <img key={item._id} className="pic" style={{maxheight:"400px",maxwidth:"400px",height:"150px",width:"150px"}} src={item.photo} alt={item.title}/>
                             )
                         })
                     }
                 </div>
        </div>
        :
        <h2>loading....!</h2>}
        
        </>
    )
}
export default Profile;