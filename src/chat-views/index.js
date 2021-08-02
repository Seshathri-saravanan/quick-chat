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
const drawerWidth = 240;
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
   margin:"20px 10px 20px 10px",
   padding:"12px",
    backgroundColor:"white",
  },
  sentMessage:{
    display:"flex",
    padding:"12px",
   margin:"20px 10px 20px 10px",
    backgroundColor:"#b3daff",
  },
  appBar: {
    width: "100%",
    height:appBarHeight,
    backgroundColor:"#0066cc",
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
    backgroundColor:"#ffffff",
    padding: theme.spacing(1),
    paddingTop:"80px",
    minHeight:"100vh",
    paddingBottom:"80px"
  },
  selectedContact:{
    backgroundColor:"#cce6ff",
    color:"white",
    "&:hover":{
      backgroundColor:"#cce6ff",
    color:"white",
    }
  }
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [socket,setSocket] = React.useState(null);
   const [selectedContact,setSelectedContact] = React.useState('');
   const [contacts,setContacts] = React.useState([]);
   const [message,setMessage] = React.useState("");
   const [allMessages,setAllMessages] = React.useState(null);
   const [selectedContactMessages,setSelectedContactMessages] = React.useState([]);
   const [newContact,setNewContact] = React.useState("");
   const account = useSelector(state=>state.account.account);
   const userName = account.username;
   //const [userName,setUserName] = React.useState("seshathri2019");
   const messageRef = React.useRef();
   const updateMessages = () => {
    if(!messageRef.current) return;
    var contactMessages = [];
    for(var message of messageRef.current){
      if(message.senderUserName==selectedContact || message.receiverUserName==selectedContact){
        contactMessages.push(message);
      }
    }
    setSelectedContactMessages(contactMessages);
   }
   React.useEffect(()=>{
    updateMessages();
   },[selectedContact,messageRef.current])
   const addMessage = (msg) => {
    var newMessages = [...messageRef.current];
    newMessages.push(msg);
    console.log("newMessages2 is",newMessages,messageRef.current);
    messageRef.current = newMessages;
    updateMessages();
   }
   const handleMessage = (data) => {
    var msg = JSON.parse(data);
    console.log("received message",msg)
    if(msg.senderUserName==userName || msg.receiverUserName==userName){
      addMessage(msg);
    }
      
  }
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
    getContacts(userName).then((contacts)=>{
      console.log("contacts is",contacts);
      setContacts(contacts);
    })
    getMessages(userName).then((messages)=>{
      console.log("messages is",messages);
      messageRef.current = messages
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
        
        <Button 
          fullWidth style={{color:"white"}} 
          onClick={()=>setSelectedContact("")}
          className={!selectedContact?classes.selectedContact:{}}
          >+ New</Button>
        <List style={{color:"white"}}>
          {contacts.map((contact, index) => (
            <ListItem 
              button 
              onClick={(e)=>{setSelectedContact(contact.username)}}
              key={contact.username} 
              style={{borderBottom:"1px solid #1a90ff"}}
              className={contact.username==selectedContact?classes.selectedContact:{}}
            >
              <ListItemAvatar>
                <Avatar alt={contact.username}>{contact.username.substr(0,1)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={contact.username} />
            </ListItem>
          ))}
        </List>
        
      </Drawer>

      <Grid className={classes.content} container direction={"row"}>
        <div className={classes.toolbar} />
          {!selectedContact && 
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
            {selectedContactMessages.map((msg,ind)=>
              <Grid container item justifyContent={msg.senderUserName==userName?"flex-end":"flex-start"}>
                <Card className={msg.senderUserName!=userName ?classes.message:classes.sentMessage}>
                    <Typography >{msg.description}</Typography>
                </Card>
              </Grid>
            )}
        </Grid>
        <Box style={{display:"flex",position:"fixed",bottom:"0px",width:"100%"}} component={Paper}>
          <TextField
            variant="outlined"
            placeholder="send a message"
            style={{width:"75%"}}
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
          />
          <Button 
            disabled={!message || !selectedContact || !socket}
            onClick={()=>{
              console.log("message send");
              socket.send(JSON.stringify({
                receiverUserName:selectedContact,
                senderUserName:userName,
                description:message
              }));
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
