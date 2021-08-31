import URL from "../constants";
import axios from "axios";
import {addAccount} from "../actions/account";
export async function getAccount(dispatch){
   try{
      console.log("add account called");
      var result = await axios({
         method: 'get',
         withCredentials:true,
         url: URL+"/account",
         
      })
      console.log("in cRUD url",URL)
      dispatch(addAccount(result.data.account))
   }
   catch(err){
      console.log("getAccount error is ",err)
   }
   return null;
}

export async function logout(){
   var result = await axios({
      method: 'get',
      url: URL+"/logout",
      withCredentials: true
   });
   return result.data.logout;
}
