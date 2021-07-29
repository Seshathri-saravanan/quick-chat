import { SET_ACCOUNT } from "../actions/account"
var initialState = {
   account:{}
}
export default function chatReducer(state=initialState,action){
   switch(action.type){
      case SET_ACCOUNT:{
         state.account = action.payload;
         return state;
      }
   }
   return state;
}