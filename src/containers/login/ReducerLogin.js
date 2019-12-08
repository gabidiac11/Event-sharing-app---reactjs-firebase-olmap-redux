import { actionTypes } from "./ActionsLogin";

export default function loginReducer(
  state = {
    userProfile: {
      firstName: "",
      lastName: "",
      email: "",
      imageLink: "",
      imageFetching: false
    }
  },
  action
) {
  switch (action.type) {
    case actionTypes.SAVE_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          firstName: action.data.firstName,
          lastName: action.data.lastName,
          email: action.data.email
        }
      };
    case actionTypes.REQUEST_UPLOAD:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          imageFetching: true
        }
      };
    case actionTypes.SAVE_USER_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          imageLink: action.data,
          imageFetching: false
        }
      };

    default:
      return state;
  }
}
