import { combineReducers } from "redux";

// Reducers for all pages
import loginReducer from "../containers/login/ReducerLogin";
import homeReducer from "../containers/home/ReducerHome";
import usersReducer from "../containers/usersPage/ReducerUsers";

// luam astea doua reducere si le
export default combineReducers({
  login: loginReducer,
  home: homeReducer,
  users: usersReducer
});
