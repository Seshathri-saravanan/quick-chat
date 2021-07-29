import { ADD_MESSAGE } from "../actions/chat"
var initialState = {
   messages:[]
}
export default function chatReducer(state=initialState,action){
   switch(action.type){
      case ADD_MESSAGE:{
         var newState = {...state}
         newState.messages.push(action.payload); 
         return newState;
      }
   }
   return state;
}