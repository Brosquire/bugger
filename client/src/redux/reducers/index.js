//importing redux dependencies for our index file to gather all reducers in one
import { combineReducers } from "redux";

//importing our auth reducer
import auth from "./auth";

//exporting the reducers combined
export default combineReducers({
  auth,
});
