import React from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  List,
  Typography,
  Button,
} from "@material-ui/core";
import { logout } from "../CRUD/account";
const appBarHeight = 70;
const useStyles = makeStyles((theme) => ({
  appBar: {
    width: "100%",
    height: appBarHeight,
    backgroundColor: "#2867d4",
    zIndex: "1200 !important",
  },
}));

export default function Header() {
  const classes = useStyles();
  const handleLogout = async () => {
    var result = await logout();
    if (result) window.location.reload();
  };
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <img
          src={"quickChatLogo.png"}
          height={50}
          width={50}
          style={{ margin: "5px" }}
        />
        <Typography
          variant="h4"
          noWrap
          style={{ fontFamily: "'PT Serif', serif" }}
        >
          Quick chat
        </Typography>
        <Button
          style={{ display: "block", marginLeft: "auto", color: "white" }}
          onClick={handleLogout}
        >
          logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
