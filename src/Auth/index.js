import React from "react";
import {AppBar,Toolbar,Drawer,Box,Typography,Button,TextField,Grid,makeStyles,Card} from '@material-ui/core'
import axios from "axios";
import { useSelector } from "react-redux";
const useStyles= makeStyles(()=>({
   root:{
      width:"100%",
      height:"99vh",
   },
   textField:{
      display:"flex",
      alignSelf:"center",
      padding:"10px",
      margin:"15px"
   },
   heading:{
      margin:"15px",
   },
   primaryButton:{
      backgroundColor:"black",
      display:"block",
      color:"white",
   },
   card:{
      padding:"15px",
   }
}))
export default function Auth({form="login"}){
   const classes = useStyles();
   const account = useSelector(state=>state.account);
   console.log("account is",account);
   const [formValue,setFormValue] = React.useState({username:'',password:''});
   const [loading,setLoading] = React.useState(false);
   const handleChange = (e) => {
      setFormValue({
         ...formValue,
         [e.target.name]:e.target.value,
      })
   }
   const handleSignUp = async() => {
      setLoading(true);
      try{
      var result = await axios.post("https://quick-chat-2021-server.herokuapp.com/signup",formValue);
      console.log("signup result is",result)
      }
      catch(error){
         console.log("errot",error);
      }
      setLoading(false);
      
   }
   const handleLogIn = async () => {
      setLoading(true);
      try{
         console.log("login input is",formValue)
      var result = await axios({
         method: 'post',
         url: "https://quick-chat-2021-server.herokuapp.com/login",
         data: {
           ...formValue
         }
       });
       console.log("login result is",result)
      }
      catch(error){
         console.log("errot",error);
      }
      setLoading(false);
   }
   const [formType,setFormType] = React.useState(form);
   return (
      <Grid container justify="center" alignItems="center" className={classes.root}>
         <Card className={classes.card}>
            <Typography variant={"h2"} className={classes.heading} align="center">Quick chat</Typography>
            <TextField 
               label={"username"} 
               name="username"
               value={formValue.username}
               className={classes.textField}
               onChange={handleChange}
            />
            <TextField 
               label={"password"}
               name="password"
               value={formValue.password}
               className={classes.textField}
               onChange={handleChange}
            />
            {formType=="signup" && 
            <Button 
               className={classes.primaryButton} 
               onClick={handleSignUp}
               fullWidth
            >
               Sign up
            </Button>}
            {formType=="login" && 
            <Button 
               className={classes.primaryButton} 
               onClick={handleLogIn}
               fullWidth
            >
                  log in
            </Button>}
            <Box>
            {formType=="signup" && 
            <>
               <span>Already have an account?</span>
               <Button 
                  onClick={()=>setFormType("login")}
               >
                  log in
               </Button>
            </>}
            {formType=="login" && 
            <>
               <span>Dont have an account?</span>
               <Button 
                  onClick={()=>setFormType("signup")}
               >
                  sign up
               </Button>
            </>}
            </Box>
         </Card>
      </Grid>
   )
}