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