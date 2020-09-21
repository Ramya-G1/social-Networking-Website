import React,{useContext,useRef,useEffect,useState} from 'react';
import {Link,useHistory} from "react-router-dom";
import {UserContext} from "../../App";
import M from 'materialize-css'
const Navbar=()=> {
  const searchModal=useRef("");
  const {state,dispatch}=useContext(UserContext);
  const [search,setSearch]=useState("");
  const [userDetails,setUserDetails] = useState([])
  const history=useHistory();
  useEffect(()=>{
    const M=window.M;

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems,{});
    });
  },[])
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])
  const deleted=()=>{
    localStorage.clear();
    dispatch({type:"CLEAR"});
    history.push("/login");
  }
  const list=()=>{
      if(state)
      {
           return [
                <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
                 <li key="2">< Link to="/createpost">CreatePost</Link></li>,
                 <li key="3">< Link to="/myfollowingpost">Myfollowing posts</Link></li>,
                 <li key="4"><Link  to="/profile">Profile</Link></li>,
                  <li key="5" onClick={()=>deleted()}><a className="btn-large disabled" style={{color:"white"}}>Logout</a></li>
           ]
      }
      else{
        return  [
              <li key="6"><Link to="/login">Login</Link></li>,
              <li key="7"><Link  to="/register">Register</Link></li>
           ]
      }
  }
  const userslist = (query)=>{
    setSearch(query)
    fetch('/searchusers',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setUserDetails(results.user)
    })
 }
    return (
      <div classname="darkmode" >
        <nav >
        
    <div className="nav-wrapper white">
      <label className="switch ">
     <input type="checkbox"/>
      <span className="slider round"></span>
     </label>
        <Link to={state?"/":"/login"} className="brand-logo-left" style={{marginleft:"10px"}}>  My INSTA</Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
       {list()}
      </ul>
      
    </div>
    <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
    <div className="modal-content">
    <input
        type="text"
        placeholder="search"
        value={search}
        onChange={e=>userslist(e.target.value)}
        />
       <ul className="collection">
       {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
               
    </ul>
    </div>
    <div className="modal-footer">
      <button className="modal-close  btn waves-effect waves-light">Enter</button>
    </div>
  </div>
  </nav>
  </div>
    )
  
}
export default Navbar;