import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import Navbar from "./components/Screens/Navbar";
import {BrowserRouter,Route,Switch,useHistory} from "react-router-dom";
import Home from "./components/Screens/Home";
import Login from "./components/Screens/Login";
import Profile from "./components/Screens/Profile";
import UserProfile from "./components/Screens/UserProfile";
import Register from "./components/Screens/Register";
import CreatePost from "./components/Screens/CreatePost";
import Getsubspost from './components/Screens/Subsposts';
import Reset from './components/Screens/Resetpassword';
import Newpassword from './components/Screens/Newpassword'
import {reducer} from "./reducers/reducer";
import {initialState} from "./reducers/reducer";
 export const UserContext=createContext();
 const Routing=()=>{
   const history=useHistory();
   const {state,dispatch}=useContext(UserContext);
   useEffect(()=>{
     const user=JSON.parse(localStorage.getItem('user'));
     if(user)
     {
      dispatch({type:"USER",payload:user})
     }
     else
     {
      if(!history.location.pathname.startsWith('/reset'))
      history.push("/login");
     }
    
   },[])
   return(
     <Switch>
<Route exact path="/"><Home/></Route>
    <Route path="/login"><Login/></Route>
    <Route path="/register"><Register/></Route>
    <Route exact path="/profile"><Profile/></Route>
    <Route path="/createpost"><CreatePost/></Route>
    <Route path="/profile/:userid"><UserProfile/></Route>
    <Route path="/myfollowingpost"><Getsubspost/></Route>
    <Route exact path="/reset"><Reset/></Route>
    <Route  path="/reset/:token"><Newpassword/></Route>
    </Switch>
   )
 }
function App() {
 const history=useHistory();
 const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar/> 
    <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
