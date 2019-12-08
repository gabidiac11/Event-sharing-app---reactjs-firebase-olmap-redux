import HereConfig from "../../config/HereConfig";
import { firebaseProvider } from "../../config/FireConfig";
import "es6-promise";
import "isomorphic-fetch";
import "fetch-jsonp-polyfill";
import { join } from "path";

export const actionTypes = {
  GET_LOCATION_OPTIONS: "GET_LOCATION_OPTIONS",
  REQUEST_LOCATION_OPTIONS: "REQUEST_LOCATION_OPTIONS",
  RECEIVE_LOCATION_OPTIONS: "RECEIVE_LOCATION_OPTIONS",
  UPDATE_FORM_STATE: "UPDATE_FORM_STATE",
  REMOVE_SELECTED_LOCATION: "REMOVE_SELECTED_LOCATION",
  REQUEST_SAVE_EVENT: "REQUEST_SAVE_EVENT",
  RECEIVE_SAVE_EVENT: "RECEIVE_SAVE_EVENT",
  RESET_FORM_STATE: "RESET_FORM_STATE",
  REQUEST_EVENT_LIST: "REQUEST_EVENT_LIST",
  RECEIVE_EVENT_LIST: "RECEIVE_EVENT_LIST",
  UPDATE_IMAGES: "UPDATE_IMAGES",

  UPDATE_EVENT: "UPDATE_EVENT",
  REQUEST_UPDATE_EVENT: "REQUEST_UPDATE_EVENT",

  REQUEST_USER_LIST: "REQUEST_USER_LIST",
  RECEIVE_USER_LIST: "RECEIVE_USER_LIST",

  UPDATE_USER_ACTIVE_PROFILE: "UPDATE_USER_ACTIVE_PROFILE", //daca dam click pe o iconita cu un participant
  REQUEST_UPDATE_USER_ACTIVE_PROFILE: "REQUEST_UPDATE_USER_ACTIVE_PROFILE",

  REQUEST_ADD_COMMENT: "REQUEST_ADD_COMENT",
  ADD_COMMENT: "ADD_COMENT",
  READ_ALL_COMMENTS: "READ_ALL_COMMENTS",

  DELETE_COMMENT: "DELETE_COMMENT",
  REQUEST_DELETE_COMMENT:"REQUEST_DELETE_COMMENT",

  REQUEST_RATING_UPDATE:"REQUEST_RATING_UPDATE",
  UPDATE_RATING:"RATING_UPDATE",
};

export const requestUpdateRating = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.REQUEST_RATING_UPDATE
    });
  };
};
export const sendRating = (payload, eventId, eventList) => {
  return dispatch => {
    dispatch(requestUpdateRating());
    
    let eventIndex=0;
    let ratings;
    for(let i = 0; i<eventList.length; i++)
    {
      if(eventList[i].eventId===eventId)
      {
        eventIndex = i;
        if(eventList[i]["ratings"])
        {
          ratings = {...eventList[i]["ratings"], [localStorage.getItem("userId")]:payload};
        }else{
          ratings = {[localStorage.getItem("userId")]:payload}
        }
        break;
      }
    }

    let rating = 0;
    for (let userId in ratings) {
      rating += parseInt(ratings[userId]);
    }
    
    console.log(rating + " " + Object.keys(ratings).length);
    rating = parseInt(rating) / Object.keys(ratings).length;

    eventList[eventIndex] = { ...eventList[eventIndex], ratings, rating};

    firebaseProvider
    .database()
    .ref(`events/${eventId}/ratings`)
    .set(ratings)
    .then( () =>{

      firebaseProvider
      .database()
      .ref(`events/${eventId}/rating`)
      .set(rating)
      .then( () => {
        dispatch({
          type: actionTypes.UPDATE_RATING,
          data: eventList
        });
      
      });

    });


    
  };
};


export const requestDeleteComment = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.REQUEST_ADD_COMMENT
    });
  };
};
export const deleteComment = (commentId) => {
  return dispatch => {
    dispatch(requestDeleteComment());
    let commentRef = firebaseProvider.database().ref('comments/' + commentId);
    commentRef.remove().then(() => {
      dispatch({
        type: actionTypes.DELETE_COMMENT,
      });
    });
    
  };
};

export const requestAddComment = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.REQUEST_ADD_COMMENT
    });
  };
};
export const addComment = (payload, eventId) => {
  return dispatch => {
    dispatch(requestAddComment());

    let comment = {
      text: payload,
      userId: localStorage.getItem("userId"),
      eventId: eventId
    };
    firebaseProvider
      .database()
      .ref(`/comments`)
      .push(comment)
      .then(snap => {
        comment = { ...comment, commentId: snap.key };
        dispatch({
          type: actionTypes.ADD_COMMENT,
          data: comment
        });
      });
  };
};

export const readAllComments = () => {
  return dispatch => {
    dispatch(requestAddComment());

    let payload = {
      commentList: []
      /*hint
       *here you can add another array for scheduled events
       *fetch scheduled events from firebase
       */
    };
    return firebaseProvider
      .database()
      .ref("comments")
      .once("value", snapshot => {
        if (snapshot.val() !== null) {
          payload["commentList"] = snapshotToArray(snapshot, "commentId");
        }
      })
      .then(() => {
        dispatch({
          type: actionTypes.READ_ALL_COMMENTS,
          data: payload["commentList"]
        });
      });
  };
};

export const requestUpdateUserActiveProfile = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.REQUEST_UPDATE_USER_ACTIVE_PROFILE
    });
  };
};
export const updateActiveProfile = payload => {
  return dispatch => {
    dispatch(requestUpdateUserActiveProfile());

    firebaseProvider
      .database()
      .ref("activeProfile/value")
      .set(payload)
      .then(() => {
        dispatch({
          type: actionTypes.UPDATE_USER_ACTIVE_PROFILE,
          data: payload
        });
      });
  };
};

export const requestUpdateJoinList = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.REQUEST_UPDATE_EVENT
    });
  };
};
export const updateEvent = payload => {
  return dispatch => {
    dispatch(requestUpdateJoinList());
    firebaseProvider
      .database()
      .ref(`events/${payload.eventId}/joinList`)
      .set(payload.joinList)
      .then(() => {
        dispatch({
          type: actionTypes.UPDATE_EVENT,
          data: payload
        });
      });
  };
};
export const UpdateImages = payload => {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_IMAGES,
      data: payload
    });
  };
};

export const resetFormState = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.RESET_FORM_STATE
    });
  };
};

export const requestLocationOptions = () => {
  return {
    type: actionTypes.REQUEST_LOCATION_OPTIONS
  };
};

export const receiveLocationOptions = data => {
  return {
    type: actionTypes.RECEIVE_LOCATION_OPTIONS,
    data: data
  };
};

export const requestSaveEvent = () => {
  return {
    type: actionTypes.REQUEST_SAVE_EVENT
  };
};

export const receiveSaveEvent = () => {
  return {
    type: actionTypes.RECEIVE_SAVE_EVENT
  };
};

export const requestEventList = () => {
  return {
    type: actionTypes.REQUEST_EVENT_LIST
  };
};

export const receiveEventList = data => {
  return {
    type: actionTypes.RECEIVE_EVENT_LIST,
    data: data
  };
};

export const getLocationOptions = suggestion => {
  return dispatch => {
    dispatch(requestLocationOptions());

    //async function for getting the locations (here api)
    return fetch(
      `${HereConfig.BASE_URL_AUTOCOMPLETE}?app_id=${
        HereConfig.APP_ID
      }&app_code=${HereConfig.APP_CODE}&query=${suggestion}&maxresults=10`
    )
      .then(
        resp => {
          return resp.json();
        },
        err => err
      )
      .then(resp => {
        dispatch(receiveLocationOptions(resp));
      });
  };
};

export const updateFormState = (propPath, payload) => {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_FORM_STATE,
      propPath: propPath,
      data: payload
    });
  };
};

export const removeSelectedLocation = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.REMOVE_SELECTED_LOCATION
    });
  };
};

export const saveEvent = payload => {
  return dispatch => {
    //asta doar updateaza variabila care ne indica fetching ul
    dispatch(requestSaveEvent());

    let locationId = payload.location.id;

    //get lat and long for a specific address
    return fetch(
      `${HereConfig.BASE_URL_GEOCODE}?app_id=${HereConfig.APP_ID}&app_code=${
        HereConfig.APP_CODE
      }&locationid=${locationId}&gen=8`,
      {
        method: "JSONP",
        callback: "jsoncallback",
        callbackName: "callbackFiiPractic"
      }
    )
      .then(
        resp => {
          return resp.json();
        },
        err => err
      )
      .then(resp => {
        const {
          Latitude
        } = resp.Response.View[0].Result[0].Location.DisplayPosition;
        const {
          Longitude
        } = resp.Response.View[0].Result[0].Location.DisplayPosition;
        const newEvent = {
          ...payload,
          location: {
            ...payload.location,
            latitude: Latitude,
            longitude: Longitude
          }
        };
        console.log("new event");
        console.log(newEvent);
        newEvent.userId = localStorage.getItem("userId");
        newEvent.joinList[0] = localStorage.getItem("userId");
        setNewEvent(newEvent, payload.userId).then(() => {
          dispatch(receiveSaveEvent());
        });
      });
  };
};

export const setNewEvent = (event, userId) => {
  console.log("SALVARE EVENIMENT:" + event);
  return firebaseProvider
    .database()
    .ref("events")
    .push()
    .set(event);
};

export const getEventList = () => {
  return dispatch => {
    dispatch(requestEventList());
    fetchEventListFirebase().then(rsp => {
      dispatch(receiveEventList(rsp));
    });
  };
};

export const fetchEventListFirebase = () => {
  let payload = {
    eventList: []
    /*hint
     *here you can add another array for scheduled events
     *fetch scheduled events from firebase
     */
  };
  return firebaseProvider
    .database()
    .ref("events")
    .once("value", snapshot => {
      if (snapshot.val() !== null) {
        payload["eventList"] = snapshotToArray(snapshot, "eventId");
      }
    })
    .then(() => {
      return payload;
    });
};

export const requestUserList = () => {
  return {
    type: actionTypes.REQUEST_USER_LIST
  };
};

export const receiveUserList = data => {
  return {
    type: actionTypes.RECEIVE_USER_LIST,
    data: data
  };
};

export const getUserList = () => {
  return dispatch => {
    dispatch(requestUserList());
    fetchUsersListFirebase().then(rsp => {
      dispatch(receiveUserList(rsp));
    });
  };
};

export const fetchUsersListFirebase = () => {
  let payload = {
    usersList: []
    /*hint
     *here you can add another array for scheduled events
     *fetch scheduled events from firebase
     */
  };
  return firebaseProvider
    .database()
    .ref("users")
    .once("value", snapshot => {
      if (snapshot.val() !== null) {
        payload["usersList"] = snapshotToArray(snapshot, "userId");
      }
    })
    .then(() => {
      return payload;
    });
};

export const snapshotToArray = (snapshot, idType) => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item = { ...item, [idType]: childSnapshot.key };
    returnArr.push(item);
  });

  return returnArr;
};
