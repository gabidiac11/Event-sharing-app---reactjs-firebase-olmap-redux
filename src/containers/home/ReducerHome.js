import { actionTypes } from "./ActionsHome";
import { categoryOptions } from "../../utils/utils";

export default function homeReducer(
  //state ul asta e ala default, initial
  state = {
    isFetching: false,
    isFetchingComment: false,
    isFetchingSearch: false,
    isFetchingUsers: false,
    isFetchingJoin: false,
    isFetchingDeleteComment: false,
    isFetchingRating:false,
    formState: {
      title: "",
      organizer: "",
      description: "",
      location: {
        id: "",
        title: ""
      },
      date: {
        day: "",
        month: "",
        entireDate: ""
      },
      category: "",
      images: [],
      joinList: [localStorage.getItem("userId")]
    },
    locationOptions: [],
    categoryOptions: categoryOptions,
    eventList: [],
    userList: [],
    activeProfile: "-1",
    commentList: [],
    
  },
  action
) {
  switch (action.type) {
    case actionTypes.RESET_FORM_STATE:
      return {
        ...state,
        formState: {
          title: "",
          organizer: "",
          description: "",
          location: {
            id: "",
            title: ""
          },
          date: {
            day: "",
            month: "",
            entireDate: ""
          },
          category: "",
          images: [],
          joinList: [localStorage.getItem("userId")]
        },
        locationOptions: [],
        activeProfile: "",
        activeProfileFetching: false
      };
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
    case actionTypes.READ_ALL_COMMENTS:
      return {
        ...state,
        isFetchingComment: false,
        commentList: action.data
      };

    case actionTypes.REQUEST_LOCATION_OPTIONS:
      return {
        ...state,
        isFetchingSearch: true
      };
    case actionTypes.RECEIVE_LOCATION_OPTIONS:
      const locationOptions = action.data.suggestions.map(item => {
        return {
          id: item.locationId,
          title: item.label
        };
      });
      return {
        ...state,
        isFetchingSearch: false,
        locationOptions: locationOptions
      };
    case actionTypes.UPDATE_IMAGES:
      return {
        ...state,
        formState: {
          ...state.formState,
          images: action.data
        }
      };
      break;
    case actionTypes.REQUEST_SAVE_EVENT:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.RECEIVE_SAVE_EVENT:
      return {
        ...state,
        isFetching: false
      };

    case actionTypes.REQUEST_EVENT_LIST:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.RECEIVE_EVENT_LIST:
      return {
        ...state,
        isFetching: false,
        eventList: action.data.eventList
      };

    case actionTypes.UPDATE_FORM_STATE:
      return {
        ...state,
        formState: {
          ...state.formState,
          [action.propPath]: action.data
        }
      };
    case actionTypes.REMOVE_SELECTED_LOCATION:
      return {
        ...state,
        formState: {
          ...state.formState,
          location: {
            id: "",
            title: ""
          }
        }
      };

    case actionTypes.REQUEST_USER_LIST:
      return {
        ...state,
        isFetchingUsers: true
      };
    case actionTypes.RECEIVE_USER_LIST:
      return {
        ...state,
        userList: action.data.usersList,
        isFetchingUsers: false,
        formState: {
          ...state.formState
        }
      };
    case actionTypes.UPDATE_EVENT:
      return {
        ...state,
        isFetching: false,
        [action.data.eventId]: action.data
      };
    case actionTypes.REQUEST_UPDATE_EVENT:
      return {
        ...state,
        isFetching: true
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
