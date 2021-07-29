import chatReducer from "./chatReducer";
import { combineReducers } from 'redux';
import accountReducer from "./accountReducer";

const rootReducer = combineReducers({
      account: accountReducer,
      chat: chatReducer
    }
)
export default rootReducer;