import React from 'react';
import { makeStyles,Grid,TextField, Button ,Box,Paper,ListItemAvatar,Avatar} from '@material-ui/core';
import {Card} from "@material-ui/core"
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { getContacts, getMessages} from "../CRUD/message";
import { io } from "socket.io-client";
import URL from "../constants";
import { useSelector } from 'react-redux';
const drawerWidth = 280;
const appBarHeight = 70;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor:"#cce6ff",
  },
  card:{
     display:"flex",
   margin:"20px 10px 20px 10px"
  },
  message:{
    color:"black",
    display:"flex",
    fontSize:"2rem",
   margin:"20px 10px 20px 10px",
   padding:"15px",
    backgroundColor:"white",
  },
  sentMessage:{
    fontSize:"2rem",
    display:"flex",
    padding:"15px",
   margin:"20px 10px 20px 10px",
    backgroundColor:"#b3daff",
  },
  appBar: {
    width: "100%",
    height:appBarHeight,
    backgroundColor:"#008ae6",
    zIndex:"1200 !important"
  },
  drawer: {
    width: drawerWidth,
    marginTop:appBarHeight,
    height: `calc(100% - ${appBarHeight}px)`,
    flexShrink: 0,
    backgroundColor:"#0066cc",
    zIndex:"300 !important"
  },
  drawerPaper: {
    width: drawerWidth,
    marginTop:appBarHeight,
    backgroundColor:"#ffffff"
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    paddingLeft:"50px",
    paddingRight:"50px",
    backgroundColor:"#ccebff",
    padding: theme.spacing(1),
    paddingTop:"80px",
    minHeight:"100vh",
    paddingBottom:"80px"
  },
  selectedContact:{
    backgroundColor:"#008ae6",
    padding:"7px",
    color:"white",
    "&:hover":{
      backgroundColor:"#008ae6",
    color:"white",
    }
  },
  contact:{
    padding:"7px",
    borderBottom:"1px solid #1a90ff"
  },

}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [socket,setSocket] = React.useState(null);
   const [message,setMessage] = React.useState("");
   const [newContact,setNewContact] = React.useState("");
   const account = useSelector(state=>state.account.account);
   const userName = account.username;
   const stateRef = React.useRef([]);
   const [threads,setThreads] = React.useState(stateRef.current);
   const newThread = {username:"",messages:[],contact:""}
   const [selectedThread,setSelectedThread] = React.useState(newThread);
   const addMessage = (msg) => {  
     console.log("add message called");
      var threadsArr = [];
      for(var thread of stateRef.current){
        var updatedMessages = [...thread.messages];
        if(msg.senderUserName==thread.username || msg.receiverUserName==thread.username){
          updatedMessages.push({...msg});
        }
        console.log("updatedMessages",updatedMessages)
        threadsArr.push({
          ...thread,
          messages:updatedMessages
        })
      }
      console.log("newthreads are",threadsArr);
      stateRef.current = threadsArr;
      setThreads(threadsArr);
   }
   const handleMessage = (data) => {
    var msg = JSON.parse(data);
    console.log("received message",msg,userName)
    if(msg.senderUserName==userName || msg.receiverUserName==userName){
      addMessage(msg);
    }
      
  }

  React.useEffect(()=>{
    for(var thread of threads){
      if(thread.username==selectedThread.username){
        setSelectedThread(thread);
      }
    }
  },[threads]);

  React.useEffect(()=>{
    if(!socket){
      var newSocket = io(URL);
      newSocket.on("connect", () => {
        console.log("connected with",newSocket.id); // x8WIv7-mJelg7on_ALbx
      });
      
      newSocket.on("disconnect", () => {
        console.log("disconeected with",newSocket.id); // undefined
      });
      newSocket.on("message",handleMessage)
      setSocket(newSocket);
    }
    
  },[]);
  
   React.useEffect(()=>{
    getContacts(userName).then(async (contacts)=>{
      console.log("contacts is",contacts);
      var messages = await getMessages(userName)
      var threadsArr = [];
      for(var contact of contacts){
        var thread = {
          username:contact.username,
          messages:[],
          contact:contact
        }
        for(var message of messages){
          var username = contact.username;
          if(message.senderUserName==username || message.receiverUserName==username){
            thread.messages.push(message);
          }
        }
        threadsArr.push(thread);
      }
      console.log("threads ",threadsArr)
      stateRef.current = [...threadsArr];
      setThreads(threadsArr)
    })
    
   },[])
  
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h4" noWrap>
            Quick chat
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant={"permanent"}
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <List>
            <ListItem 
              button 
              key={"new"}
              onClick={()=>setSelectedThread({...newThread})}
              className={!selectedThread.contact?classes.selectedContact:classes.contact}
            >
              <ListItemText primary={"+ New"} style={{textAlign:"center"}}/>
            </ListItem>
          {threads.map((thread, index) => (
            <ListItem 
              button 
              onClick={(e)=>{setSelectedThread({...thread})}}
              key={thread.username} 
              className={thread.username==selectedThread.username?classes.selectedContact:classes.contact}
            >
              <ListItemAvatar>
                <Avatar alt={thread.username}>{thread.username.substr(0,1)}</Avatar>
              </ListItemAvatar>
            
              <ListItemText 
                primary={thread.username} 
                secondary={thread.messages.length>0 && thread.messages[thread.messages.length-1].description}
              />
              <Typography>{thread.messages.length>0 && thread.messages[thread.messages.length-1].createAt}</Typography>
              </ListItem>
          ))}
        </List>
        
      </Drawer>

      <Grid className={classes.content} container direction={"row"}>
        <div className={classes.toolbar} />
          {!selectedThread.contact && 
          <>
          <Typography>To :</Typography>
          <TextField
            onChange={(e)=>{setNewContact(e.target.value)}}
            value={newContact}
          >
            
            </TextField>
          </>
          }
          <Grid container item alignItems="flex-start" alignContent={"flex-start"}>
            {selectedThread.messages.map((msg,ind)=>
              <Grid container item justifyContent={msg.senderUserName==userName?"flex-end":"flex-start"}>
                <Card className={msg.senderUserName!=userName ?classes.message:classes.sentMessage}>
                    <Typography >{msg.description}</Typography>
                </Card>
              </Grid>
            )}
        </Grid>
        <Box style={{display:"flex",position:"fixed",bottom:"0px",width:`calc(95% - ${drawerWidth}px)`}} component={Paper}>
          <TextField
            variant="outlined"
            placeholder="send a message"
            style={{flexGrow:10}}
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
          />
          <Button 
            disabled={!message || (!selectedThread.username && !newContact) || !socket }
            style={{flexGrow:1,marginRight:"auto"}}
            onClick={()=>{
              console.log("message send");
              socket.send(JSON.stringify({
                receiverUserName:selectedThread.username || newContact,
                senderUserName:userName,
                description:message
              }));
              setMessage("");
            }
          }
            //onClick={()=>{addMessage("seshathri2019",selectedContact || newContact,message);setMessage("");}}
          >
            Send
          </Button>
        </Box>
      </Grid>
    </div>
  );
}
