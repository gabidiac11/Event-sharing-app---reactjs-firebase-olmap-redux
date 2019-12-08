export const actionTypes = {
  SAVE_USER_PROFILE: "SAVE_USER_PROFILE",
  UPLOAD_IMAGE: "UPLOAD_IMAGE",
  REQUEST_UPLOAD: "REQUEST_UPLOAD"
};

export const saveUserProfile = payload => {
  return dispatch => {
    dispatch({
      type: actionTypes.SAVE_USER_PROFILE,
      data: payload
    });
  };
};

export const uploadImage = payload => {
  return dispatch => {
    dispatch({
      type: actionTypes.REQUEST_UPLOAD
    });
    dispatch({
      type: actionTypes.UPLOAD_IMAGE,
      data: payload
    });
  };
};
    