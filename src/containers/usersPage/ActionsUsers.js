import { firebaseProvider } from "../../config/FireConfig";
import "es6-promise";
import "isomorphic-fetch";
import "fetch-jsonp-polyfill";

export const actionTypes = {
  REQUEST_USER_LIST: "REQUEST_USER_LIST",
  RECEIVE_USER_LIST: "RECEIVE_USER_LIST",

  REQUEST_EVENT_LIST: "REQUEST_EVENT_LIST",
  RECEIVE_EVENT_LIST: "RECEIVE_EVENT_LIST",

  UPDATE_EVENT: "UPDATE_EVENT",
  REQUEST_UPDATE_EVENT: "REQUEST_UPDATE_EVENT",

  UPDATE_USER_ACTIVE_PROFILE: "UPDATE_USER_ACTIVE_PROFILE",
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
      eventId: eventId,
      date: {
        date: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        hours: new Date().getHours(),
        min: new Date().getMinutes(),
        sec: new Date().getSeconds()
      }
    };
    firebaseProvider
      .database()
      .ref(`/comments`)
      .push(comment)
      .then(snap => {
        comment = { commentId: snap.key, ...comment };
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
export const getActiveProfile = () => {
  let payload;

  return dispatch => {
    dispatch(requestUpdateUserActiveProfile());

    firebaseProvider
      .database()
      .ref("activeProfile/value")
      .once("value", snapshot => {
        if (snapshot.val() !== null) {
          console.log(snapshot.val() + " e active");
          payload = snapshot.val();
          dispatch({
            type: actionTypes.UPDATE_USER_ACTIVE_PROFILE,
            data: payload
          });
        }
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



export const snapshotToArray = (snapshot, idType) => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item = { ...item, [idType]: childSnapshot.key };
    returnArr.push(item);
  });

  return returnArr;
};
