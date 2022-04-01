import React from "react";
import {
  makeStyles,
  Grid,
  TextField,
  Button,
  Box,
  Paper,
  ListItemAvatar,
  Avatar,
  IconButton,
  CardContent,
} from "@material-ui/core";
import { Card } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { getContacts, getMessages } from "../CRUD/message";
import { io } from "socket.io-client";
import URL from "../constants";
import ArrowDropDownCircleOutlinedIcon from "@material-ui/icons/ArrowDropDownCircleOutlined";
import moment from "moment";
import { useSelector } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";
import Header from "./header";
const drawerWidth = 280;
const appBarHeight = 70;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    fontFamily: "'PT Serif', serif !important",
    backgroundColor: "#008ae6",
  },
  card: {
    display: "flex",
    margin: "20px 10px 20px 10px",
  },
  message: {
    color: "black",
    display: "flex",
    fontSize: "2rem",
    padding: "15px",
    margin: "20px",
    color: "#325980",
    backgroundColor: "white",
  },
  sentMessage: {
    fontSize: "2rem",
    display: "flex",
    padding: "15px",
    margin: "20px",
    color: "white",
    backgroundColor: "#0077ff",
  },
  drawer: {
    width: drawerWidth,
    marginTop: appBarHeight,
    height: `calc(100% - ${appBarHeight}px)`,
    flexShrink: 0,
    backgroundColor: "#008ae6",
    zIndex: "300 !important",
  },
  drawerPaper: {
    width: drawerWidth,
    marginTop: appBarHeight,
    backgroundColor: "#ffffff",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    paddingLeft: "50px",
    paddingRight: "50px",
    backgroundColor: "#008ae6",
    padding: theme.spacing(1),
    paddingTop: "80px",
    minHeight: "100vh",
    paddingBottom: "80px",
  },
  selectedContact: {
    backgroundColor: "#356fd4",
    padding: "7px",
    color: "white",
    "&:hover": {
      backgroundColor: "#0b5487",
      color: "white",
    },
  },
  contact: {
    padding: "7px",
    borderBottom: "1px solid #1a90ff",
  },
}));

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [socket, setSocket] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [newContact, setNewContact] = React.useState("");
  const account = useSelector((state) => state.account.account);
  const userName = account.username;
  const stateRef = React.useRef([]);
  const [threads, setThreads] = React.useState(stateRef.current);
  const newThread = { username: "", messages: [], contact: "" };
  const [selectedThread, setSelectedThread] = React.useState(newThread);
  const lastMessageRef = React.useRef(null);
  const scrollBarRef = React.useRef(null);
  const addMessage = (msg) => {
    console.log("add message called");
    var threadsArr = [];
    for (var thread of stateRef.current) {
      var updatedMessages = [...thread.messages];
      if (
        msg.senderUserName == thread.username ||
        msg.receiverUserName == thread.username
      ) {
        updatedMessages.push({ ...msg });
      }
      console.log("updatedMessages", updatedMessages);
      threadsArr.push({
        ...thread,
        messages: updatedMessages,
      });
    }
    console.log("newthreads are", threadsArr);
    stateRef.current = threadsArr;
    setThreads(threadsArr);
  };
  const handleMessage = (data) => {
    var msg = JSON.parse(data);
    console.log("received message", msg, userName);
    if (msg.senderUserName == userName || msg.receiverUserName == userName) {
      addMessage(msg);
    }
  };

  React.useEffect(() => {
    for (var thread of threads) {
      if (thread.username == selectedThread.username) {
        setSelectedThread(thread);
      }
    }
  }, [threads]);

  React.useEffect(() => {
    scrollToBottom();
  }, [selectedThread]);
  React.useEffect(() => {
    if (!socket) {
      var newSocket = io(URL);
      newSocket.on("connect", () => {
        console.log("connected with", newSocket.id); // x8WIv7-mJelg7on_ALbx
      });

      newSocket.on("disconnect", () => {
        console.log("disconeected with", newSocket.id); // undefined
      });
      newSocket.on("message", handleMessage);
      setSocket(newSocket);
    }
  }, []);

  React.useEffect(() => {
    getContacts(userName).then(async (contacts) => {
      console.log("contacts is", contacts);
      var messages = await getMessages(userName);
      var threadsArr = [];
      for (var contact of contacts) {
        var thread = {
          username: contact.username,
          messages: [],
          contact: contact,
        };
        for (var message of messages) {
          var username = contact.username;
          if (
            message.senderUserName == username ||
            message.receiverUserName == username
          ) {
            thread.messages.push(message);
          }
        }
        threadsArr.push(thread);
      }
      console.log("threads ", threadsArr);
      stateRef.current = [...threadsArr];
      setThreads(threadsArr);
    });
  }, []);
  const scrollToBottom = () => {
    scrollBarRef.current && scrollBarRef.current.scrollToBottom();
  };

  return (
    <div className={classes.root}>
      <Header />
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
            onClick={() => setSelectedThread({ ...newThread })}
            className={
              !selectedThread.contact
                ? classes.selectedContact
                : classes.contact
            }
          >
            <ListItemText primary={"+ New"} style={{ textAlign: "center" }} />
          </ListItem>
          {threads.map((thread, index) => (
            <ListItem
              button
              onClick={(e) => {
                setSelectedThread({ ...thread });
              }}
              key={thread.username}
              className={
                thread.username == selectedThread.username
                  ? classes.selectedContact
                  : classes.contact
              }
            >
              <ListItemAvatar>
                <Avatar alt={thread.username}>
                  {thread.username.substr(0, 1)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                style={{ fontFamily: "'PT Serif', serif" }}
                primary={thread.username}
                secondary={
                  thread.messages.length > 0 &&
                  thread.messages[thread.messages.length - 1].description
                }
              />
              <Typography style={{ fontSize: "0.7rem", color: "gray" }}>
                {thread.messages.length > 0 &&
                  moment(
                    thread.messages[thread.messages.length - 1].createdAt
                  ).format("MMM Do, HH:mm")}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Grid
        className={classes.content}
        container
        direction={"row"}
        style={{ backgroundImage: `url(bg.jpeg)` }}
      >
        <Scrollbars
          ref={scrollBarRef}
          renderTrackHorizontal={() => <div style={{ display: "none" }} />}
          style={{ width: "100%", height: "100%" }}
          autoHide
          // Hide delay in ms
          autoHideTimeout={1000}
          // Duration for hide animation in ms.
          autoHideDuration={200}
        >
          {!selectedThread.contact && (
            <>
              <Typography>To :</Typography>
              <TextField
                onChange={(e) => {
                  setNewContact(e.target.value);
                }}
                value={newContact}
              ></TextField>
            </>
          )}

          <Grid
            container
            item
            alignItems="flex-start"
            alignContent={"flex-start"}
            style={{ overflowX: "hidden" }}
          >
            {selectedThread.messages.map((msg, ind) => (
              <Grid
                container
                item
                justifyContent={
                  msg.senderUserName == userName ? "flex-end" : "flex-start"
                }
              >
                <Card
                  className={
                    msg.senderUserName != userName
                      ? classes.message
                      : classes.sentMessage
                  }
                  ref={
                    ind + 1 == selectedThread.messages.length
                      ? lastMessageRef
                      : null
                  }
                >
                  <CardContent style={{ margin: "0", padding: "0" }}>
                    <Typography style={{ fontFamily: "'PT Serif', serif" }}>
                      {msg.description}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "0.8rem",
                        display: "block",
                        textAlign: "left",
                        color: "gray",
                      }}
                    >
                      {moment(msg.createdAt).format("MMM Do, HH:mm")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <IconButton
            onClick={scrollToBottom}
            style={{ position: "fixed", right: "0px", bottom: "70px" }}
          >
            <ArrowDropDownCircleOutlinedIcon
              fontSize={"large"}
              style={{ color: "white" }}
            />
          </IconButton>
          <Box
            style={{
              display: "flex",
              position: "fixed",
              bottom: "0px",
              width: `calc(95% - ${drawerWidth}px)`,
            }}
            component={Paper}
          >
            <TextField
              variant="outlined"
              placeholder="send a message"
              style={{ flexGrow: 10 }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              disabled={
                !message || (!selectedThread.username && !newContact) || !socket
              }
              style={{ flexGrow: 1, marginRight: "auto" }}
              onClick={() => {
                console.log("message send");
                socket.send(
                  JSON.stringify({
                    receiverUserName: selectedThread.username || newContact,
                    senderUserName: userName,
                    description: message,
                  })
                );
                setMessage("");
              }}
              //onClick={()=>{addMessage("seshathri2019",selectedContact || newContact,message);setMessage("");}}
            >
              Send
            </Button>
          </Box>
        </Scrollbars>
      </Grid>
    </div>
  );
}
