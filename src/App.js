import logo from './logo.svg';
import './App.css';
import Chat from './chat-views';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Auth from "./Auth";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {addMessage} from "./actions/chat";
import {addAccount} from "./actions/account";
import axios from "axios";
function App() {
  const dispatch = useDispatch();
  const account = useSelector(state=>state.account.account);
  React.useEffect(()=>{
    try{
      axios({
        method: 'post',
        url: "https://quick-chat-2021-server.herokuapp.com/account"
      }).then(result=>dispatch(addAccount(result.data.account)))
      
    }
    catch(err){
      console.log(err);
    }
    
  })
  React.useEffect(()=>{
    console.log("account changed",account);
    if(account.username){
      axios({
        method: 'post',
        url: "https://quick-chat-2021-server.herokuapp.com/message"
      }).then(result=>{
        console.log("message",result);
        dispatch(addMessage(result.data.message))
      })
    }
  },[account])

  return (
    <Router>
      <Switch>
        
        <Route path="/login">
          <Auth/>
        </Route>
        <Route path="/signup">
          <Auth/>
        </Route>
        <Route path="/chat">
          <Chat/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
