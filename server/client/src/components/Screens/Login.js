import React,{useState,useContext} from "react";
import {Link, useHistory} from "react-router-dom";
import M from "materialize-css";
import {UserContext} from "../../App";
const Login=()=>{
    const history=useHistory();
    const {state,dispatch}=useContext(UserContext);
    const [password, setPassword]= useState("")
     const [email, setEmail]= useState("")
     const postData=()=>{
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
      {  M.toast({html:"Invalid email",classes:'#f44336 red'});
      return;
     }
          fetch("/login",{
              method:"post",
              headers:{
                  "Content-Type":"application/json"
              },
            body:JSON.stringify({
                password,
                email
            })
          }).then(res=>res.json())
          .then(data=>{
              if(data.error)
             M.toast({html:data.error,classes:"#f44336 red"});
            else{
              localStorage.setItem("jwt",data.token);
              localStorage.setItem("user",JSON.stringify(data.user));
              dispatch({type:"USER",payload:data.user});
              M.toast({html:"Login Completed",classes:"#00e676 green accent-3"});
              history.push('/');
            }
          }).catch(error=>{
            console.log(error);
          })
      }
    return (
        <div>
    <div  className="mycard">
        <div className="card auth-card">
        <h2 >Login</h2>
        <input
        type="email"
        placeholder="email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        />
        <input
       type="password"
        placeholder="password"
       value={password}
        onChange={e=>setPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light " onClick={()=>postData()} >Login
        </button>
       <h6><Link to="/reset">Forgot password??</Link></h6> 
        </div>
    </div>
</div>
    )
}
export default Login;