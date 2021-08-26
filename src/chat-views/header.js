import React from 'react';
import { makeStyles,AppBar,Toolbar,List,Typography, Button} from '@material-ui/core';
const appBarHeight = 70;
const useStyles = makeStyles((theme) => ({
  appBar: {
    width: "100%",
    height:appBarHeight,
    backgroundColor:"#008ae6",
    zIndex:"1200 !important"
  },
}))
export default function Header(){
   const classes= useStyles();
   return (
   <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
      <Typography variant="h4" noWrap style={{fontFamily: "'PT Serif', serif"}}>
         Quick chat
      </Typography>
      <Button style={{display:"block",marginLeft:"auto",color:"white"}} 
         onClick={()=>{
            document.cookie =  'user=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.reload();
         }}>
         logout
      </Button>
      </Toolbar>
   </AppBar>
   );
}