import URL from "../constants";
import axios from "axios";
export async function getContacts(userName){
   var result = await axios({
      method: 'get',
      url: URL+"/contacts",
      
   })
   var userContacts = [];
   var contacts = result.data.contacts;
   for(var contact of contacts){
      if(userName!=contact.username)
      userContacts.push(contact);
   }
   return userContacts;
   
}

export async function getMessages(userName){
   var result = await axios({
      method: 'get',
      url: URL+"/message",
   })
   var messages = result.data.messages;
   var userMessages = [];
   for(var message of messages){
      if(message.senderUserName==userName || message.receiverUserName==userName){
         userMessages.push(message);
      }
   }
   return userMessages;
   
}


export async function addMessage(senderUserName,receiverUserName,description){
   var result = await axios({
      method: 'post',
      url: URL+"/message",
      data:{
         senderUserName:senderUserName,
         receiverUserName:receiverUserName,
         description:description
      }
   })
   console.log("message sent",result,{
      senderUserName,
      receiverUserName,
      description
   });
   return result.data.message;
}