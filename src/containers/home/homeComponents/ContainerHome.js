import { connect } from "react-redux";
import HomeComponent from "./Home";
import {
  getLocationOptions,
  updateFormState,
  removeSelectedLocation,
  saveEvent,
  resetFormState,
  getEventList,
  UpdateImages,
  getUserList,
  updateEvent,
  updateActiveProfile,
  addComment,
  deleteComment,
  readAllComments,
  sendRating
} from "../ActionsHome";

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
  onDeleteComment: (payload) => {
    dispatch(deleteComment(payload));
  },
  onAddComment: (payload, eventId) => {
    dispatch(addComment(payload, eventId));
  },
  onReadAllComments: () => {
    dispatch(readAllComments());
  },

  onUpdateActiveProfile: payload => {
    dispatch(updateActiveProfile(payload));
  },
  onUpdateImages: (payload, joinList) => {
    dispatch(UpdateImages(payload, joinList));
  },

  onUpdateEvent: payload => {
    dispatch(updateEvent(payload));
  },
  onGetLocationOptions: suggestion => {
    dispatch(getLocationOptions(suggestion));
  },
  onUpdateFormState: (propPath, payload) => {
    dispatch(updateFormState(propPath, payload));
  },
  onRemoveSelectedLocation: () => {
    dispatch(removeSelectedLocation());
  },
  onSaveEvent: props => {
    const {
      title,
      organizer,
      description,
      location,
      date,
      category,
      images,
      joinList
    } = props;
    //adaug creator aici
    let creator =
      localStorage.getItem("firstName") +
      " " +
      localStorage.getItem("lastName");
    const payload = {
      userId: localStorage.getItem("userId"),
      title,
      organizer,
      description,
      location,
      date,
      category,
      images,
      joinList: [localStorage.getItem("userId")],
      creator
    };
    dispatch(saveEvent(payload));
  },
  onResetFormState: () => {
    dispatch(resetFormState());
  },
  onGetEventList: () => {
    dispatch(getEventList());
  },
  onGetUserList: () => {
    dispatch(getUserList());
  }
});

const Home = connect(
  //state-ul celor doua coponente login si home
  mapStateProps,
  //functionalitati
  mapDispatchToProps
)(HomeComponent);

export default Home;
