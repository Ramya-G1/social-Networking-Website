import React,{useEffect,useState,useContext, useCallback} from "react";
import {UserContext} from '../../App'
const Getsubspost=()=>{
    const [upload,setUpload]=useState([]);
    const {state,dispatch}=useContext(UserContext);
    const [comment,setComment]=useState("");
    useEffect(()=>{
       fetch("/getsubspost",{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
       }).then(res=>res.json())
       .then(data=>{
           setUpload(data.posts)
       }).catch(error=>{
           console.log(error)
       })
    },[])
    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
          const newData = upload.map(item=>{
              if(item._id==result._id){
                  return result
                 
              }else{
                  return item
              }
          })
          setUpload(newData)
        }).catch(error=>{
            console.log(error)
        })
  }
  const unlikePost = (id)=>{
    fetch('/unlike',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
      const newData = upload.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      setUpload(newData)
    }).catch(error=>{
        console.log(error)
    })
}
const makeComment = (text,postId)=>{
    fetch("/postcomment",{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId,
            text
        })
    }).then(res=>res.json())
    .then(result=>{
        const newData = upload.map(item=>{
            if(item._id==result._id){
                return result
            }else{
                return item
            }
        })
        setUpload(newData)
    }).catch(error=>{
        console.log(error)
    })
}
const deletePost = (postid)=>{
    fetch(`/deletepost/${postid}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        const newData = upload.filter(item=>{
            return item._id !== result._id
        })
        setUpload(newData)
    })
}
const deletecomment=(postid,commentid)=>{
    fetch(`/deletecomment/${postid}/${commentid}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
      const newData = upload.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      setUpload(newData)
    }).catch(error=>{
        console.log(error)
    })
}
return (

    <div className="homepage" style={{maxWidth:"500px",margin:"50px auto"}}>
        {upload.map(item=>{
            const {_id}=item.postedBy;
            return (
                
                <div className="card homepage-card" key={item._id}>
                <h5 style={{marginLeft:"10px"}}>{item.postedBy.name} {item.postedBy._id==state._id 
                            && <i className="material-icons" style={{float:"right" }} 
                            onClick={()=>deletePost(item._id )}
                            >delete</i>
                }</h5>
                <div className="card-image">
                    <img
                    src={item.photo}
                    />
                </div>
                 <div className="card-Content" style={{marginLeft:"10px"}}>
                  <i className="material-icons" style={{color:"red"}}>favorite</i>
                            {item.likes.includes(state._id)
                            ? 
                             <i className="material-icons"
                                    onClick={()=>{unlikePost(item._id )}}
                              >thumb_down</i>
                             :
                            <i className="material-icons"
                            onClick={()=>{likePost(item._id )}}
                            >thumb_up</i>
                            } 
                     <h6>{item.likes.length} likes</h6>
                     <h6>{item.title}</h6>
                     <p>{item.body}</p>
                     {
                     item.comments.map(result=>{
                     return(
                    <h6 key={result._id}><span style={{fontWeight:"500"}}>{result.postedBy.name}</span> {result.text}  {result.postedBy._id == state._id 
                       && <i className="material-icons" style={{float:"right" ,height:"20px"}} 
                        onClick={()=>deletecomment(item._id ,result._id)}
                    >delete</i>}</h6>
                     )
                     })
                     }
                     <form  autocomplete="off" onSubmit={(e)=>{
                      e.preventDefault()
                          }}>
                         <div style={{display:"flex"}}>
                          <input id ="wrap" type="text" placeholder="add a comment" value={comment}  onChange={e=>setComment(e.target.value)}
                          /> 
                          <i className="material-icons" style={{float:"right",paddingTop:"15px",marginRight:"10px"}}
                        onClick={(e)=>{makeComment(comment,item._id);setComment(" ")}} >send</i>
                        </div>
                        
                    </form>
                 </div>
            </div>
            )
        })}
    
    </div>
    
);
}
export default Getsubspost;