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
import {addMessage, getContacts, getMessages} from "../CRUD/message";
const drawerWidth = 240;

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
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor:"#1a90ff"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor:"#1a90ff"
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor:"#66b5ff"
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor:"#cce6ff",
    padding: theme.spacing(1),
    paddingTop:"80px",
    height:"100vh",
    paddingBottom:"80px"
  },
  selectedContact:{
    backgroundColor:"#1a90ff",
    color:"white",
    "&:hover":{
      backgroundColor:"#1a90ff",
    color:"white",
    }
  }
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const threads = [
     {
         name:"angelina juliet",
         messages:["hello","hii","am","hello","hii","am","hello","hii","am","hello","hii","am","hello","hii","am"]
     },
     {
         name:"roman",
         messages:["hello","hii","am"]

     }
   ]
   const [selectedContact,setSelectedContact] = React.useState('');
   const [contacts,setContacts] = React.useState([]);
   const [message,setMessage] = React.useState("");
   const [allMessages,setAllMessages] = React.useState([]);
   const [selectedContactMessages,setSelectedContactMessages] = React.useState([]);
   const [newContact,setNewContact] = React.useState("");
   const [userName,setUserName] = React.useState("seshathri2019");
   React.useEffect(()=>{
    var contactMessages = [];
    for(var message of allMessages){
      if(message.senderUserName==selectedContact || message.receiverUserName==selectedContact){
        contactMessages.push(message);
      }
    }
    setSelectedContactMessages(contactMessages);
   },[selectedContact])
   React.useEffect(()=>{
    getContacts(userName).then((contacts)=>{
      console.log("contacts is",contacts);
      setContacts(contacts);
    })
    getMessages(userName).then((messages)=>{
      console.log("messages is",messages);
      setAllMessages(messages);
    })
   },[])
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Quick chat
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        
        <Typography variant="h5" style={{color:"white",padding:"10px"}}>Contacts</Typography>
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
            disabled={!message || !selectedContact}
            onClick={()=>{addMessage("seshathri2019",selectedContact || newContact,message);setMessage("");}}
          >
            Send
          </Button>
        </Box>
      </Grid>
    </div>
  );
}
