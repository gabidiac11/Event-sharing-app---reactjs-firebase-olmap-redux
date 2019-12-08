import { actionTypes } from "./ActionsUsers";

export default function usersReducer(
  //state ul asta e ala default, initial
  state = {
    isFetching: false,
    isFetchingEventList: false,
    isFetchingComment: false,
    isFetchingDeleteComment: false,
    isFetchingRating:false,
    userList: [],
    eventList: [],
    activeProfile: "-1",
    activeProfileFetching: false,
    commentList: [],
    
  },
  action
) {
  switch (action.type) {
    case actionTypes.REQUEST_RATING_UPDATE:
    return {
      ...state,
      isFetchingRating: true
    };
    case actionTypes.UPDATE_RATING:
    return {
      ...state,
      eventList:action.data,
      isFetchingRating:false
    };
    case actionTypes.REQUEST_ADD_COMMENT:
      return {
        ...state,
        isFetchingComment: true
      };
    case actionTypes.ADD_COMMENT:
      return {
        ...state,
        isFetchingComment: false
      };
    case actionTypes.REQUEST_DELETE_COMMENT:
      return {
        ...state,
        isFetchingDeleteComment: true
      };
    case actionTypes.DELETE_COMMENT:
      return {
        ...state,
        isFetchingDeleteComment: false
      };
    case actionTypes.READ_ALL_COMMENTS:
      return {
        ...state,
        isFetchingComment: false,
        commentList: action.data
      };
    case actionTypes.REQUEST_USER_LIST:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.RECEIVE_USER_LIST:
      return {
        ...state,
        userList: action.data.usersList,
        isFetching: false
      };
    case actionTypes.REQUEST_EVENT_LIST:
      return {
        ...state,
        isFetchingEventList: true
      };
    case actionTypes.RECEIVE_EVENT_LIST:
      return {
        ...state,
        eventList: action.data.eventList,
        isFetchingEventList: false
      };

    case actionTypes.UPDATE_EVENT:
      return {
        ...state,
        isFetchingEventList: false,

        [action.data.eventId]: action.data
      };

    case actionTypes.REQUEST_UPDATE_EVENT:
      return {
        ...state,
        isFetchingEventList: true
      };

    case actionTypes.REQUEST_UPDATE_USER_ACTIVE_PROFILE:
      return {
        ...state,
        activeProfileFetching: true
      };
    case actionTypes.UPDATE_USER_ACTIVE_PROFILE:
      return {
        ...state,
        activeProfile: action.data,
        activeProfileFetching: false
      };
    default:
      return state;
  }
}
