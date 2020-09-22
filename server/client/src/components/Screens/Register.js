import React,{useState}from "react";
import {useHistory} from "react-router-dom";
import {useEffect} from "react";
import M from "materialize-css";
const Register =()=>{
    const history=useHistory();
  const [name,setName]=useState("");
  const [password, setPassword]= useState("")
   const [email, setEmail]= useState("")
   const [image,setImage]=useState("");
   const [url,setUrl]=useState("");
    useEffect(()=>{
    if(url)
    postremaining();
   },[url])
   const postpic=()=>{
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
const postremaining=()=>{
  if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
  {  M.toast({html:"Invalid email",classes:'#f44336 red'});
  return;
 }
      fetch("/register",{
          method:"post",
          headers:{
              "Content-Type":"application/json"
          },
        body:JSON.stringify({
            name,
            password,
            email
        })
      }).then(res=>res.json())
      .then(data=>{
        console.log(data)
          if(data.error)
         M.toast({html:data.error,classes:"#f44336 red"});
        else{
          M.toast({html:data.message,classes:"#00e676 green accent-3"});
          history.push('/login');
        }
      }).catch(error=>{
        console.log(error);
      })
}
   const postData=()=>{
     if(image)
     postpic();
     else
    postremaining()
    }
return (
    <div>
    <div  className="mycard">
        <div className="card auth-card">
        <h2>Register</h2>
        <input
        type="email"
        placeholder="email"
        value={email}
       onChange={e=>setEmail(e.target.value)}
        />
        <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e=>setName(e.target.value)}
        />
        <input
       type="password"
        placeholder="password"
       value={password}
        onChange={e=>setPassword(e.target.value)}
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
        <button className="btn waves-effect waves-light" onClick={()=>postData()} >Register
        </button>
        </div>
    </div>
</div>
);
}
export default Register;