import React, { Component } from "react";
import { Grid, Button } from "semantic-ui-react";

import "../../../assets/css/users.css";

//my components
import ImageLoader from "../../../components/reuseableCompoennts/ImageUploader";
import UserListBar from "../reusebleFields/UserListBar";

//services
import { firebaseProvider } from "../../../config/FireConfig";

//components
import EventItem from "../reusebleFields/eventItemUsers";

import { storage } from "../../../config/FireConfig";

class UsersComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUserIndex: -1,
      activeEvent: -1,
      image: null,
      imageLink: "",
      imageFetching: false,
      showImgUploader:"none",

      activeUserStatsCount: [],
      eventStatButton: 0,

      minimizeProfile:false,

    };
  }

  componentDidMount = () => {
    //as fi vrut sa folosesc din this.props.home.eventList, dar
    //nu pot fi sigur ca e initializat ... si n-am acces la modificare
    this.intializeEventList();
    this.initializeUserList();
    this.initializeActiveProfile();
    this.initializeCommentList();
  };

  initializeCommentList = () => {
    firebaseProvider
      .database()
      .ref("comments")
      .on("value", () => {
        this.props.onReadAllComments();
      });
  };

  initializeActiveProfile = () => {
    this.props.onGetActiveProfile();
  };

  setActiveProfile = activeInd => {
    let activeUserStatsCount = [0, 0, 0];

    if (activeInd > -1 && !this.props.users.isFetching) {
      const { userList, eventList } = this.props.users;
      for (let i = 0; i < eventList.length; i++) {
        if (eventList[i].userId === userList[activeInd].userId)
          activeUserStatsCount[0]++;
        if (eventList[i]["ratings"]) {
          if (eventList[i].ratings[userList[activeInd].userId])
            activeUserStatsCount[2]++;
        }
        for (let j = 0; j < eventList[i].joinList.length; j++) {
          if (eventList[i].joinList[j] === userList[activeInd].userId) {
            activeUserStatsCount[1]++;
            break;
          }
        }
      }
    }

    this.setState({
      activeUserIndex: activeInd,
      activeUserStatsCount: activeUserStatsCount,
      eventStatButton: 0
    });
  };

  setEventStatButton = index => {
    this.setState({ eventStatButton: index });
  };

  intializeEventList = () => {
    firebaseProvider
      .database()
      .ref("events")
      .on("value", () => {
        this.props.onGetEventList();
      });
  };

  initializeUserList = () => {
    firebaseProvider
      .database()
      .ref("users")
      .on("value", () => {
        this.props.onGetUserList();
      });
  };

  joinEvent = item => {
    if (this.props.users.isFetching) return;

    if (item.joinList.indexOf(localStorage.getItem("userId")) > -1) {
      return;
    }
    item.joinList.push(localStorage.getItem("userId"));
    this.props.onUpdateEvent(item);
  };

  disJoinEvent = item => {
    if (this.props.users.isFetching) return;

    if (item.joinList.indexOf(localStorage.getItem("userId")) == -1) {
      return;
    }

    for (let i = item.joinList.length - 1; i >= 0; i--) {
      if (item.joinList[i] === localStorage.getItem("userId")) {
        item.joinList.splice(i, 1);
        break;
      }
    }

    this.props.onUpdateEvent(item);
  };

  handleChangeImage = e => {
    
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.uploadImage(image);
    }
  };
  uploadImage = (image) => {
    if (!image) return;

    this.setState({ imageFetching: true });
    //am generat un uniq key pt numele imaginilor ca sa nu se suprascrie

    const userUid = localStorage.getItem("userId");

    const uploadTask = storage.ref(`usersImage/${userUid}`);
    uploadTask
      .put(
        image
        // arrow function aici da eroare aia cu 25 stacks
        // = {
        //     //poate aici voi seta isfetching true daca imi face probleme (prin redux)
        //     //apoi in than il voi reseta
        // }
      )
      //l-am pus in then pt ca era o eroare: trb sa astept sa fetchingghiuiasca inainte sa fac asta
      .then(() => {
        storage
          .ref("usersImage")
          .child(`${userUid}`)
          .getDownloadURL()
          .then(url => {
            firebaseProvider
              .database()
              .ref(`users/${userUid}/image/link`)
              .set(url)
              .then(() => {
                this.initializeUserList();
                this.setState({ imageFetching: false });
              });
          });
      });

    //
  };

  onAddComment = (text, eventId) => {
    this.props.onAddComment(text, eventId);
    this.initializeCommentList();
  };
  onDeleteComment = commentId => {
    this.props.onDeleteComment(commentId);
    this.initializeCommentList();
  };
  onSendRating = (rating, eventId) => {
    this.props.onSendRating(rating, eventId, this.props.users.eventList);
  };

  serachForUser = (userId, index) => {
    const { isFetching, userList } = this.props.users;
    if (!isFetching) {
      return userId === userList[this.state.activeUserIndex].userId;
    }
    return false;
  };

  setDisplayImgUploaderButton = display =>
  {
    this.setState({showImgUploader:display});
  }

  scrollEvent = (e) =>{
    let element = e.target
    if (element.scrollTop > 10) {
      //aici planuiam sa minimizez bara cand dau scroll 10 sau mai mult
      //mai sunt niste ajustari de styling ca sa mearga cum trebuie
      //this.setState({minimizeProfile:true});
      
    }
    
   // for(let i = 0; i<element.child)
//element.scrollHeight - this is the height in pixels of the elements content, including content not visible on the screen due to css overflow.

// element.scrollTop - the height in pixels that an element’s content is scrolled vertically.

// element.clientHeight - the height in pixels of the scrollable part of the element.
  }

  render() {
    const {
      userList,
      isFetching,
      isFetchingEventList,
      eventList,
      activeProfile,
      commentList,
      isFetchingComment,
      isFetchingDeleteComments
    } = this.props.users;

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div className="wholeContainer">
          <div 
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              width: "15%",
              height: "98%"
            }}
          >
            <UserListBar
              userList={userList}
              isFetching={isFetching}
              activeUserIndex={this.state.activeUserIndex}
              setActiveProfile={this.setActiveProfile}
            />
          </div>
          <div className="userInfo">
            {this.state.activeUserIndex == -1 ? (
              <div className="sideContent">
                <Grid columns={1} divided>
                  <Grid.Row>
                    {!isFetchingEventList ? (
                      eventList.map((item, index) => (
                        <Grid.Column>
                          <EventItem
                            key={index}
                            event={item}
                            isActive={true}
                            userList={userList}
                            isJoined={
                              item.joinList.indexOf(
                                localStorage.getItem("userId")
                              ) > -1
                                ? true
                                : false
                            }
                            joinEvent={() => this.joinEvent(item)}
                            disJoinEvent={() => this.disJoinEvent(item)}
                            onClickUserIcon={this.setActiveProfile}
                            addComment={this.onAddComment}
                            onDeleteComment={this.onDeleteComment}
                            isFetchingComment={isFetchingComment}
                            isFetchingDeleteComments={isFetchingDeleteComments}
                            commentList={commentList}
                            onSendRating={this.onSendRating}
                          />
                        </Grid.Column>
                      ))
                    ) : (
                      <div>Event list is fetching....</div>
                    )}
                  </Grid.Row>
                </Grid>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  paddingLeft: "0.7%",
                  paddingRight: "0.1%"
                }}
              >
                <div className="profileContainer" style={{
                  height:`${this.state.minimizeProfile? "10%" : "22%"}`
                }}>
                  <div className="profileInfoContainer">
                    <div
                      style={{
                        height: "93%",
                        padding: "20px"
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          position: "relative",
                          height: "100%"
                        }}
                      >
                        { userList[this.state.activeUserIndex].userId === localStorage.getItem("userId")?
                        <div 
                          className="imgProfileUploader"
                          style={{
                            display:`${!this.state.imageFetching? this.state.showImgUploader : "initial"}`
                          }}
                          >

                          <label
                            for="file-input"
                            style={{ width: "100%", height: "100%" }}
                            onMouseLeave={()=>this.setDisplayImgUploaderButton("none")}
                          >
                            <img
                              className="blackOVerlay"
                              src="https://firebasestorage.googleapis.com/v0/b/fiipracticproiect.appspot.com/o/Zh6MY2P11VYgHc4FERv2Dy8AQq32%2F-LfprGPBBu7zjzR-t5U5?alt=media&token=c9cf5d99-7327-482f-981b-182dbce25b25"
                              onMouseLeave={()=>this.setDisplayImgUploaderButton("none")}
                            />
                            <img
                              src={
                                `${ !this.state.imageFetching
                                   ? "https://firebasestorage.googleapis.com/v0/b/fiipracticproiect.appspot.com/o/Zh6MY2P11VYgHc4FERv2Dy8AQq32%2F-LfptWBeEzpmQdeirItF?alt=media&token=a85f1026-97bb-4884-bc93-1031024e6ee2"
                                   : "https://firebasestorage.googleapis.com/v0/b/fiipracticproiect.appspot.com/o/Zh6MY2P11VYgHc4FERv2Dy8AQq32%2F-LfvERJecnI_a1z3fGRd?alt=media&token=07cb49d7-4dc5-45a8-8218-3f58eecab8e3"
                                }`
                              }
                              onMouseOver={()=>this.setDisplayImgUploaderButton("initial")}
                              className={
                                `uploadIconButton${ this.state.imageFetching
                                   ? " imageGifLoading" : "" }`
                              }
                              
                            />
                          </label>
                          <input
                            id="file-input"
                            type="file"
                            onChange={this.handleChangeImage}
                          />
                        </div>
                        : ""
                        }
                        <img
                          className="imgProfile"
                          src={`${
                            userList[this.state.activeUserIndex]["image"]
                              ? userList[this.state.activeUserIndex]["image"]
                                  .link
                              : "https://react.semantic-ui.com/images/wireframe/square-image.png"
                          }`}
                          onMouseOver={()=>this.setDisplayImgUploaderButton("initial")}
                          
                        />
                      </div>
                    </div>
                    <div className="userDetails">
                      <div>
                        <div className="userNameText">
                          {userList[this.state.activeUserIndex].firstName}{" "}
                          {userList[this.state.activeUserIndex].lastName}
                        </div>
                      </div>
                      <div>
                        <hr />
                        {
                          this.state.minimizeProfile ? "" :
                          <div>
                          &#9745;{" "}
                          {`Events created by: ${
                            this.state.activeUserStatsCount[0]
                          } `}
                          &#9745;{" "}
                          {`Events joined by: ${
                            this.state.activeUserStatsCount[1]
                          } `}
                          &#9745;{" "}
                          {`Events rated by: ${
                            this.state.activeUserStatsCount[2]
                          } `}
                        </div>
                        }
                        
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profileContentContainer" 
                  style={{
                    height:`${this.state.minimizeProfile? "87.2%" : "77.2%"}`
                  }}
                >
                  <div className="profileContentButtonsSection">
                    <div
                      onClick={() => this.setEventStatButton(0)}
                      className={`profileContentButton${
                        this.state.eventStatButton === 0
                          ? " profileContnetButtonActive"
                          : ""
                      }`}
                    >
                      Events Created
                    </div>
                    <div
                      onClick={() => this.setEventStatButton(1)}
                      className={`profileContentButton${
                        this.state.eventStatButton === 1
                          ? " profileContnetButtonActive"
                          : ""
                      }`}
                    >
                      Events Joined
                    </div>
                    <div
                      onClick={() => this.setEventStatButton(2)}
                      className={`profileContentButton${
                        this.state.eventStatButton === 2
                          ? " profileContnetButtonActive"
                          : ""
                      }`}
                    >
                      Events rated
                    </div>
                  </div>

                  <div
                  onScroll={this.scrollEvent}
                  className="eventListContainerContent">
                    {!isFetching
                      ? eventList.map((event, index) => (
                          <div style={{ width: "100%" }}>
                            {(this.state.eventStatButton === 0 &&
                              event.userId ===
                                userList[this.state.activeUserIndex].userId) ||
                            (this.state.eventStatButton === 1 &&
                              event.userId !==
                                userList[this.state.activeUserIndex].userId &&
                              event.joinList.find(this.serachForUser)) ||
                            (this.state.eventStatButton === 2 &&
                              event["ratings"] &&
                              event.ratings[
                                userList[this.state.activeUserIndex].userId
                              ]) ? (
                              <EventItem
                                key={index}
                                event={event}
                                isActive={true}
                                userList={userList}
                                isJoined={
                                  event.joinList.indexOf(
                                    localStorage.getItem("userId")
                                  ) > -1
                                    ? true
                                    : false
                                }
                                joinEvent={() => this.joinEvent(event)}
                                disJoinEvent={() => this.disJoinEvent(event)}
                                onClickUserIcon={this.setActiveProfile}
                                addComment={this.onAddComment}
                                onDeleteComment={this.onDeleteComment}
                                isFetchingComment={isFetchingComment}
                                isFetchingDeleteComments={
                                  isFetchingDeleteComments
                                }
                                commentList={commentList}
                                onSendRating={this.onSendRating}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default UsersComponent;
