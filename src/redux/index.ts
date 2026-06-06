import { combineReducers } from "@reduxjs/toolkit";

import curEventReducer from "./slices/event";
import eventsReducer from "./slices/events";
import curTransactionReducer from "./slices/transaction";
import userReducer from "./slices/user";

const rootReducer = combineReducers({
  user: userReducer,
  curEvent: curEventReducer,
  events: eventsReducer,
  curTransaction: curTransactionReducer,
});

export default rootReducer;
