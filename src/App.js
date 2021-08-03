import logo from './logo.svg';
import './App.css';
import Chat from './chat-views';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import Auth from "./Auth";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {addMessage} from "./actions/chat";
import { getAccount } from './CRUD/account';
import axios from "axios";
import URL from "./constants";

function App() {
  console.log("URL is",URL);
  const dispatch = useDispatch();
  
  const account = useSelector(state=>state.account.account);

  React.useEffect(()=>{
      getAccount(dispatch);
  },[])
  /*
  React.useEffect(()=>{
    console.log("account changed",account);
      axios({
        method: 'get',
        url: URL+"/message",
        data:{
          username:"seshathri2019"
        }
      }).then(result=>{
        console.log("message",result);
        dispatch(addMessage(result.data.message))
      }).catch(err=>console.error(err));
  },[])
  */
  return (
    <Router>
      <Switch>
      <Route exact path="/">
        {account.username ? <Redirect to="/chat" /> : <Redirect to="/login" />}
      </Route>
        <Route path="/login">
        {account.username ? <Redirect to="/chat" /> : <Auth/>}
          
        </Route>
        <Route path="/signup">
        {account.username ? <Redirect to="/chat" /> : <Auth/>}
          
        </Route>
        <Route path="/chat">
          {account.username ? <Chat/>: <Redirect to="/login" />}
          
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
