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
function App() {
  const dispatch = useDispatch();
  const account = useSelector(state=>state.account.account);
  React.useEffect(()=>{
    if(account.username){
      
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
