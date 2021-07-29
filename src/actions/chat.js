export const ADD_MESSAGE = "chat/addMessage";
export function addMessage(message){
   return ({
      type:ADD_MESSAGE,
      payload:{
         message:message
      }
   })
}