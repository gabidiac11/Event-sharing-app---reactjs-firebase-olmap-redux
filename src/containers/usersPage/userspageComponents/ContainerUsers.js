import { connect } from "react-redux";
import UsersComponent from "./Users";
import {
  getUserList,
  getEventList,
  updateEvent,
  updateActiveProfile,
  getActiveProfile,
  addComment,
  deleteComment,
  readAllComments,
  sendRating
} from "../ActionsUsers";

//dam un share la chestii catre home si din login
//atribuim state ul special dedicat din statul global care e definit din homeReducer componentei home
//la fel facem si cu login
//global state
const mapStateProps = state => ({
  home: Object.assign({}, state.home),
  login: Object.assign({}, state.login),
  users: Object.assign({}, state.users)
});

//functionalitatile reducerului sunt puse in ActionsHome
//e mai usor dealing cu firebase asa
const mapDispatchToProps = dispatch => ({
  onSendRating: (payload, eventId, eventList) => {
    dispatch(sendRating(payload, eventId, eventList));
  },
  onAddComment: (payload, eventId) => {
    dispatch(addComment(payload, eventId));
  },
  onDeleteComment: (payload) => {
    dispatch(deleteComment(payload));
  },
  onReadAllComments: () => {
    dispatch(readAllComments());
  },
  //updateaza reducerul
  onGetActiveProfile: () => {
    dispatch(getActiveProfile());
  },

  //updateaza reducerul si database ul
  onUpdateActiveProfile: payload => {
    dispatch(updateActiveProfile(payload));
  },
  onGetUserList: () => {
    dispatch(getUserList());
  },
  onGetEventList: () => {
    dispatch(getEventList());
  },

  onUpdateEvent: payload => {
    dispatch(updateEvent(payload));
  }
});

const Users = connect(
  //state-ul celor doua coponente login si home
  mapStateProps,
  //functionalitati
  mapDispatchToProps
)(UsersComponent);

export default Users;
