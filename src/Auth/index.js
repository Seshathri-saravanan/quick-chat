import React, { useDebugValue } from "react";
import {AppBar,Toolbar,Drawer,Box,Typography,Button,TextField,Grid,makeStyles,Card} from '@material-ui/core'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {addAccount} from "../actions/account"
import URL from "../constants"
const useStyles= makeStyles(()=>({
   root:{
      width:"100%",
      height:"100vh",
      backgroundColor:"#008ae6"
   },
   textField:{
      display:"block",
      margin:"25px"
   },
   heading:{
      margin:"15px",
      color:"#006bb3"
   },
   primaryButton:{
      backgroundColor:"#008ae6",
      display:"block",
      color:"white",
      "&:hover":{
         backgroundColor:"#007acc"
      }
   },
   card:{
      padding:"15px",
      boxShadow:"10px"
   }
}))
export default function Auth({form="login"}){
   const classes = useStyles();
   //const account = useSelector(state=>state.account);
   const dispatch = useDispatch();
   //console.log("account is",account);
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
      var result = await axios.post(URL+"/signup",formValue);
      console.log("signup result is",result)
      dispatch(addAccount(result.data.account));
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
            url: URL+"/login",
            withCredentials: true,
            data: {
            ...formValue
            }
         });
       dispatch(addAccount(result.data.account));
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
            <Typography variant={"h4"} className={classes.heading} align="center">Quick chat</Typography>
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
               type="password"
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