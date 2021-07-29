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
function App() {
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
