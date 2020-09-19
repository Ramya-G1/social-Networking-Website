import React,{useContext} from 'react';
import {Link,useHistory} from "react-router-dom";
import {UserContext} from "../../App";
const Navbar=()=> {
  const {state,dispatch}=useContext(UserContext);
  const history=useHistory();
  const deleted=()=>{
    localStorage.clear();
    dispatch({type:"CLEAR"});
    history.push("/login");
  }
  const list=()=>{
      if(state)
      {
           return [
                 <li>< Link to="/createpost">CreatePost</Link></li>,
                 <li>< Link to="/myfollowingpost">Myfollowing posts</Link></li>,
                 <li><Link  to="/profile">Profile</Link></li>,
                  <li onClick={()=>deleted()}><a className="btn-large disabled" style={{color:"white"}}>Logout</a></li>
           ]
      }
      else{
        return  [
              <li><Link to="/login">Login</Link></li>,
              <li><Link  to="/register">Register</Link></li>
           ]
      }
  }
    return (
        <nav>
    <div className="nav-wrapper white">
        <Link to={state?"/":"/login"} className="brand-logo-left">MyINSTA</Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
       {list()}
      </ul>
    </div>
  </nav>
    )
}
export default Navbar;