import React,{useState,useContext}from "react";
import {Link,useHistory} from "react-router-dom";
import {useEffect} from "react";
import M from "materialize-css";
import {UserContext} from "../../App";
const Editpassword =()=>{
    const history=useHistory();
  const {state,dispatch}=useContext(UserContext);
  const [name,setName]=useState("");
  const [password, setPassword]= useState("")
   const [email, setEmail]= useState("")
   const [newpassword,setNewPassword]=useState("");
const postremaining=(password,newpassword)=>{
  if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
  {  M.toast({html:"Invalid email",classes:'#f44336 red'});
  return;
 }
      fetch("/editprofile",{
          method:"put",
          headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
        body:JSON.stringify({
            email,
           password:password,
           newpassword:newpassword
        })
      }).then(res=>res.json())
      .then(data=>{
        console.log(data)
          if(data.error)
         M.toast({html:data.error,classes:"#f44336 red"});
        else{
         // M.toast({html:data.message,classes:"#00e676 green accent-3"});
          history.push('/profile');
        }
      }).catch(error=>{
        console.log(error);
      })
}
return (
    <div>
    <div  className="mycard">
        <div className="card auth-card">
        <h2>Edit Password</h2>
        <input
        type="email"
        placeholder="email"
        value={email}
       onChange={e=>setEmail(e.target.value)}
        />
        <input
       type="password"
        placeholder="current password"
       value={password}
        onChange={e=>setPassword(e.target.value)}
        />
       <input
       type="password"
        placeholder="New password"
       value={newpassword}
        onChange={e=>setNewPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light" onClick={()=>postremaining(password,newpassword)} >Submit
        </button>
        <h6><Link to="/editname">Wanna Change Username!??</Link></h6>
        </div> 
    </div>
</div>
);
}
export default Editpassword;