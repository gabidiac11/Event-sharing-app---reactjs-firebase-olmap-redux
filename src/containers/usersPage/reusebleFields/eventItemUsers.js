import React, { Component } from "react";
import "../../../assets/css/eventItem.css";
// import { fromJSON } from "tough-cookie";
import AnImage from "../../../containers/home/reusableComponents/AnImage";
import {
  Button,
  Container,
  Divider,
  Grid,
  Segment,
  Comment,
  Form,
  Header
} from "semantic-ui-react";
import Participant from "../../../containers/home/reusableComponents/Participant";
import AddComment from "../../../containers/home/reusableComponents/AddComment";
import EventStarRating from "./EventStarRating";
import UserEventReview from "./UserEventReview";

class EventItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.event,
      activeInd: 0,
      plusOrMinus: "+",
      activeDescItems: [false, false, false, false],
      showAllReviews: false,
      showUserNameToolprit: false
    };
  }
  onClickUserIcon = userId => {
    const { userList } = this.props;
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].userId === userId) {
        this.props.onClickUserIcon(i);
        break;
      }
    }
  };
  isPaticipating = userId => {
    if (this.props.event.joinList.indexOf(userId) > -1) return true;
    return false;
  };
  switchImages = op => {
    if (op === 1) {
      let i = this.state.activeInd;
      if (i >= this.state.event.images.length - 1) return;
      else i += 1;
      this.setState({ activeInd: i, plusOrMinus: "-" });
    } else {
      let i = this.state.activeInd;
      if (i === 0) return;
      else i -= 1;
      this.setState({ activeInd: i, plusOrMinus: "+" });
    }
  };
  addComment = text => {
    this.props.addComment(text, this.props.event.eventId);
  };
  displayCommentDate = date => {
    if (!date) return "";
    const currentDate = {
      date: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      hours: new Date().getHours(),
      min: new Date().getMinutes(),
      sec: new Date().getSeconds()
    };
    let dateText = "";
    switch (date.year) {
      case currentDate.year:
        switch (date.month) {
          case currentDate.month:
            switch (date.date) {
              case currentDate.date:
                dateText =
                  "Today at " + date.hours + ":" + date.min + ":" + date.sec;
                break;
              default:
                dateText =
                  `${currentDate.date - date.date} ${
                    currentDate.date - date.date == 1 ? "day" : "days"
                  } ago, at ` +
                  date.hours +
                  ":" +
                  date.min +
                  ":" +
                  date.sec;
                break;
            }
            break;
          default:
            dateText =
              date.date +
              "." +
              date.month +
              "." +
              date.year +
              ", at " +
              date.hours +
              ":" +
              date.min +
              ":" +
              date.sec;
            break;
        }
        break;
      default:
        dateText =
          `${currentDate.year - date.year} years ago, ` +
          date.date +
          "." +
          date.month +
          ", at " +
          date.hours +
          ":" +
          date.min +
          ":" +
          date.sec;
        break;
    }

    return <div>{dateText}</div>;
  };
  onDeleteComment = commentId => {
    this.props.onDeleteComment(commentId);
  };
  toggleActiveDescItem = index => {
    // return;
    let activeDescItemsCopy = this.state.activeDescItems;
    activeDescItemsCopy[index] = this.state.activeDescItems[index]
      ? false
      : true;
    this.setState({ activeDescItems: activeDescItemsCopy });
  };
  onSendRating = rating => {
    this.props.onSendRating(rating, this.props.event.eventId);
  };
  displayUsersReviews = active => {
    this.setState({ showAllReviews: active });
    console.log(this.state.showAllReviews);
  };
  onHoverUserName = show => {
    this.setState({ showUserNameToolprit: show });
  };

  onClickInactiveEvent = (e) => {
    console.log(e.target);
  if(e.target.tagName != "BUTTON")
    this.props.onClickEvent();
  }

  render() {
    const {
      commentList,
      isFetchingComment,
      userList,
      isFetchingRating,
      event
    } = this.props;
    const ratings = this.props.event["ratings"];
    return (
      <div
        style={{
          width: "100%",
          marginBottom: "20px",
          position:"relative",
        }}
      >

        {!this.props.isActive ? (
          <div
          onClick={(e)=>this.onClickInactiveEvent(e)} 
            className="eventInactive"
          >
                <div className="imageContainer">
                  {
                    <img
                      className="front-image"
                      src={`${
                        this.props.event["images"]
                          ? this.props.event.images[0]
                          : "https://storage.pixteller.com/designs/designs-images/2017-07-30/11/backgrounds-passion-simple-background-image-1-597d9e3c588e7.png"
                      }`}
                    />
                  }
                  <div className="date">
                    <div className="event_item-date-container">
                      <div className="event_item-date-day">
                        {this.state.event.date.day}
                      </div>
                      <div className="event_item-date-month">
                        {this.state.event.date.month}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "69%",
                    display: "flex",
                    flexDirection: "column",
                    padding:"5%",
                  }}
                >
                  <div className="event_item-info-title">
                      {this.state.event.title}
                  </div>
                  <div className="event_item-info-date">
                      <i className="clock outline grey icon" />
                      {this.state.event.date.entireDate}
                  </div>
                  <div className="event_item-info-location">
                      <i className="map marker alternate grey icon" />
                      {this.state.event.location.title}
                  </div>
                  <div className="event_item-info-organizer">
                    <div className="event_item-info-organizer-label">
                      <i className="circle orange icon tiny" />
                      <span>Organizer:</span>
                    </div>
                    {this.state.event.organizer}
                  </div>
                  <div className="event_item-info-category">
                    <div className="event_item-info-category-label">
                      <i className="circle orange icon tiny" />
                      <span>Category:</span>
                    </div>
                    {this.state.event.category}
                  </div>
                  <div className="event_item-action-container" />
                  <div className="event_item-info-title">
                    Created by <a>{this.state.event.creator}</a>
                  </div>
                  <div>


                  <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "nowrap",
                        width: "100%",
                        padding: "10px"
                      }}
                    >
                      {this.props.event.userId != localStorage.getItem("userId") ? (
                        !this.props.isJoined ? (
                          <Button
                            style={{ width: "24%" }}
                            onClick={() => this.props.joinEvent(this.props.event)}
                            primary
                          >
                            Join
                          </Button>
                        ) : (
                          <Button
                            style={{ width: "24%", }}
                            onClick={() =>
                              this.props.disJoinEvent(this.props.event)
                            }
                          >
                            Disjoin
                          </Button>
                        )
                      ) : (
                        ""
                      )}

                      <div
                        style={{
                          width: "76%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderLeft: "2px solid rgba(0, 0, 0, 0.2)",
                          marginRight: "4%"
                        }}
                      >
                        {!isFetchingRating ? (
                          <EventStarRating
                            type="allRatings"
                            rating={`${
                              this.props.event["rating"]
                                ? this.props.event.rating
                                : 0
                            }`}
                            onSendRating={this.onSendRating}
                            displayUsersReviews={this.displayUsersReviews}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  

                  </div>
                  
              </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.03)",
              padding: "10px",
              marginBottom: "20px",
              position:"relative"
            }}
            className={`event_item-container`}
          >
                          {
                this.props.canBeMinimized?

                  <div 
                  onClick={this.props.onMinimizeEvent}
                  className="contractEventButton">
                    <div>
                         &#8249;
                    </div>
                   
                  </div>
                : ""
              }
            <div style={{ width: "100%", }}>
              


              <div
                style={{
                  width: "100%",
                  marginBottom: "20px",
                  border: "1px solid #dddfe2",
                  borderRadius: "3px",
                  boxShadow: "1px 1px 0px 1px rgba(0,0,0,0.2)"
                }}
              >
                {this.state.event["images"] ? (
                  <div className="slideshow-container">
                    {//daca e cel activ si are imagini voi mapa imaginile puse
                    this.state.event.images.map((item, index) => (
                      <AnImage
                        imageLink={item}
                        transformProp={`${
                          index == this.state.activeInd
                            ? "translateX(0%)"
                            : this.state.plusOrMinus === "+"
                            ? index < this.state.activeInd
                              ? "translateX(-100%)"
                              : "translateX(100%)"
                            : index < this.state.activeInd
                            ? "translateX(-100%)"
                            : "translateX(+100%)"
                        }`}
                      />
                    ))}
                    <div className="prev" onClick={e => this.switchImages(-1)}>
                      &#10094;
                    </div>
                    <div className="next" onClick={e => this.switchImages(1)}>
                      &#10095;
                    </div>
                  </div>
                ) : (
                  <div  className="slideshow-container">
                    <AnImage
                        imageLink={"https://storage.pixteller.com/designs/designs-images/2017-07-30/11/backgrounds-passion-simple-background-image-1-597d9e3c588e7.png"
                      }
                        transformProp={"translateX(0%)"}
                      />
                    <img
                      className="slideShowImage"
                    />
                  </div>
                )}
              </div>
              <div
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #dddfe2",
                  borderRadius: "3px",
                  boxShadow: "1px 1px 0px 1px rgba(0,0,0,0.2)",
                  backgroundColor: "white"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "10px"
                  }}
                >
                  <div
                    style={{
                      flexGrow: "0"
                    }}
                  >
                    <div style={{ padding: "10px 10px 0px 0px" }}>
                      <div
                        style={{
                          textAlign: "center",
                          fontFamily: '"Times New Roman", Times, serif',
                          textTransform: "uppercase",
                          color: "red",
                          fontSize: "25px",
                          margin: "5px"
                        }}
                      >
                        {this.state.event.date.day}
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          fontFamily: '"Times New Roman", Times, serif',
                          textTransform: "uppercase",
                          color: "black",
                          fontWeight: "5px",
                          fontSize: "20px",
                          margin: "5px"
                        }}
                      >
                        {this.state.event.date.month}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      flexGrow: "5",
                      paddingTop: "5px",
                      paddingLeft: "20px",
                      borderLeft: "2px solid rgba(0,0,0,0.09)"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "space-between"
                      }}
                    >
                      <div
                        style={{
                          textAlign: "justify",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          textTransform: "capitalize",
                          fontWeight: "6px",
                          color: "black",
                          fontSize: "30px",
                          paddingBottom: "10px"
                        }}
                      >
                        {this.state.event.title}
                      </div>
                      <div
                        style={{
                          textAlign: "justify",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          textTransform: "capitalize",
                          fontWeight: "normal",
                          color: "grey",
                          fontSize: "15px",
                          padding: "10px 0px 5px 0px",
                          position: "relative"
                        }}
                      >
                        Created by{" "}
                        <a
                          className="userNameStyle"
                          onClick={() =>
                            this.onClickUserIcon(this.props.event.userId)
                          }
                          // onMouseOver={() => this.onHoverUserName(true)}
                          // onMouseOut={() => this.onHoverUserName(true)}
                        >
                          {this.state.event.creator}
                          <div className="imageUserTooltip">
                            {userList.map(user =>
                              user.userId === event.userId ? (
                                <img
                                  style={{ width: "100%", height: "100%" }}
                                  src={`${
                                    user["image"]
                                      ? user["image"].link
                                      : "https://react.semantic-ui.com/images/wireframe/square-image.png"
                                  }`}
                                />
                              ) : (
                                ""
                              )
                            )}
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <hr
                  style={{
                    display: "block",
                    width: "97%",
                    marginTop: "0.5em",
                    marginBottom: "0.5em",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderStyle: "inset",
                    borderWidth: "1px",
                    backgroundColor: "rgba(0,0,0,0.2)"
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    flexWrap: "nowrap",
                    width: "100%",
                    padding: "10px"
                  }}
                >
                  {this.props.event.userId != localStorage.getItem("userId") ? (
                    !this.props.isJoined ? (
                      <Button
                        style={{ width: "20%" }}
                        onClick={() => this.props.joinEvent(this.props.event)}
                        primary
                      >
                        Join
                      </Button>
                    ) : (
                      <Button
                        style={{ width: "20%" }}
                        onClick={() =>
                          this.props.disJoinEvent(this.props.event)
                        }
                      >
                        Disjoin
                      </Button>
                    )
                  ) : (
                    ""
                  )}

                  <div
                    style={{
                      width: "76%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderLeft: "2px solid rgba(0, 0, 0, 0.2)",
                      marginRight: "4%"
                    }}
                  >
                    {!isFetchingRating ? (
                      <div style={{width:"40%"}}>
                      
                      <EventStarRating
                        type="allRatings"
                        rating={`${
                          this.props.event["rating"]
                            ? this.props.event.rating
                            : 0
                        }`}
                        onSendRating={this.onSendRating}
                        displayUsersReviews={this.displayUsersReviews}
                      />
                      </div>
                    ) : (
                      ""
                    )}
                    {!isFetchingRating ? (
                      <div style={{width:"40%"}}>
                      <EventStarRating
                        type={"userRating"}
                        rating={`${
                          ratings
                            ? ratings[localStorage.getItem("userId")]
                              ? ratings[localStorage.getItem("userId")]
                              : 0
                            : 0
                        }`}
                        onSendRating={this.onSendRating}
                      />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              
              </div>
              <div
                style={{
                  width: "100%",
                  marginBottom: "-10px",
                  border: "1px solid #dddfe2",
                  borderRadius: "3px",
                  boxShadow: "1px 1px 0px 1px rgba(0,0,0,0.2)",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "space-around",
                  alignItems: "baseline",
                  padding: "5px 5px 5px 5px",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center"
                }}
              >
                {userList.map(user =>
                  this.state.showAllReviews &&
                  ratings &&
                  user.userId !== localStorage.getItem("userId") ? (
                    ratings[user.userId] ? (
                      <UserEventReview
                        onClickUserIcon={() =>
                          this.onClickUserIcon(user.userId)
                        }
                        isFetchingRating={isFetchingRating}
                        user={user}
                        imageLink={`${
                          user["image"]
                            ? user["image"].link
                            : "https://react.semantic-ui.com/images/wireframe/square-image.png"
                        }`}
                        rating={ratings[user.userId]}
                      />
                    ) : (
                      " "
                    )
                  ) : (
                    ""
                  )
                )}
              </div>
              <div
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #dddfe2",
                  borderRadius: "3px",
                  boxShadow: "1px 1px 0px 1px rgba(0,0,0,0.2)",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "space-around",
                  padding: "5px 5px 0px 5px"
                }}
              >
                <div
                  className={`itemFeature${
                    this.state.activeDescItems[0] ? " activeItemFeature" : ""
                  }`}
                  onClick={() => this.toggleActiveDescItem(0)}
                >
                  <div className="textItem">
                    <i className="map marker alternate grey icon" />
                    <p> {this.state.event.location.title}</p>
                  </div>
                </div>

                <div
                  className={`itemFeature${
                    this.state.activeDescItems[1] ? " activeItemFeature" : ""
                  }`}
                  onClick={() => this.toggleActiveDescItem(1)}
                >
                  <div className="itemType">
                    <i className="circle orange icon tiny" />
                    <span>Description:</span>
                  </div>
                  <div className="textItem">
                    <p>{this.state.event.description}</p>
                  </div>
                </div>

                <div
                  className={`itemFeature${
                    this.state.activeDescItems[2] ? " activeItemFeature" : ""
                  }`}
                  onClick={() => this.toggleActiveDescItem(2)}
                >
                  <div className="itemType">
                    <i className="circle orange icon tiny" />
                    <span>Organiser:</span>
                  </div>
                  <div className="textItem">
                    <p>{this.state.event.organizer}</p>
                  </div>
                </div>

                <div
                  className={`itemFeature${
                    this.state.activeDescItems[3] ? " activeItemFeature" : ""
                  }`}
                  onClick={() => this.toggleActiveDescItem(3)}
                >
                  <div className="itemType">
                    <i className="circle orange icon tiny" />
                    <span>Category:</span>
                  </div>
                  <div className="textItem">
                    <p>{this.state.event.category}</p>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #dddfe2",
                  borderRadius: "3px",
                  boxShadow: "1px 1px 0px 1px rgba(0,0,0,0.2)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "space-around",
                  padding: "5px 5px 0px 5px"
                }}
              >
                <div style={{ width: "100%" }}>Participanti:</div>

                <div className="partIconContainer">
                  <div className="iconsFlexList">
                    {userList.map(item =>
                      this.isPaticipating(item.userId) ? (
                        <Participant
                          onClickUserIcon={() =>
                            this.onClickUserIcon(item.userId)
                          }
                          firstName={item.firstName}
                          userId={item.userId}
                          lastName={item.lastName}
                          imageLink={`${
                            item["image"]
                              ? item["image"].link
                              : "https://react.semantic-ui.com/images/wireframe/square-image.png"
                          }`}
                        />
                      ) : (
                        ""
                      )
                    )}
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  border: "1px solid #dddfe2",
                  borderRadius: "3px",
                  boxShadow: "1px 1px 0px 1px rgba(0,0,0,0.2)",
                  backgroundColor: "rgba(255,255,255,0.8",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "space-around",
                  padding: "5px 5px 0px 5px"
                }}
              >
                <Comment.Group
                  style={{
                    backgroundColor: "rgba(242, 243, 245, 0.3)",
                    padding: "10px",
                    width: "100%",
                    maxWidth: "100%"
                  }}
                >
                  <Header as="h3" dividing>
                    Comments
                  </Header>
                  {!isFetchingComment
                    ? commentList.map((comment, index) =>
                        comment.eventId === this.props.event.eventId ? (
                          <Comment.Group
                            style={{
                              maxWidth: "100%",
                              display: "inline-block",
                              marginBottom: "-10px"
                            }}
                          >
                            {userList.map(user =>
                              user.userId == comment.userId ? (
                                <Comment
                                  style={{
                                    padding: "10px",
                                    marginTop: "-1%",
                                    width: "100%",
                                    maxWidth: "100%"
                                  }}
                                >
                                  <Comment.Avatar
                                    style={{
                                      width: "10%",
                                      boxShadow: "3px 3px 3px rgba(0,0,0,0.2)",
                                      cursor: "pointer"
                                    }}
                                    src={`${
                                      user["image"]
                                        ? user["image"].link
                                        : "https://react.semantic-ui.com/images/wireframe/square-image.png"
                                    }`}
                                    onClick={() =>
                                      this.onClickUserIcon(user.userId)
                                    }
                                  />
                                  <Comment.Content>
                                    <Comment.Author
                                      as="a"
                                      style={{
                                        marginLeft: "5px",
                                        cursor: "pointer"
                                      }}
                                      onClick={() =>
                                        this.onClickUserIcon(user.userId)
                                      }
                                    >
                                      {`${user.firstName} ${user.lastName}`}
                                    </Comment.Author>
                                    <Comment.Metadata>
                                      {this.displayCommentDate(comment.date)}
                                    </Comment.Metadata>

                                    <div
                                      style={{
                                        marginTop: "5px",
                                        marginLeft: "5%",
                                        width: "95%",
                                        padding: "10px 40px 10px 10px",
                                        backgroundColor: "#f2f3f5",
                                        borderRadius: "25px",
                                        boxShadow:
                                          "3px 3px 3px rgba(0,0,0,0.1)",
                                        positon: "relative"
                                      }}
                                    >
                                      <Container textAlign="justified">
                                        <p className="textComment">
                                          {comment.text}
                                        </p>
                                      </Container>
                                      {!this.isFetchingDeleteComment &&
                                      (localStorage.getItem("userId") ===
                                        comment.userId ||
                                        this.props.event.userId ===
                                          localStorage.getItem("userId")) ? (
                                        <div
                                          className="deleteCommentButton"
                                          onClick={() =>
                                            this.onDeleteComment(
                                              comment.commentId
                                            )
                                          }
                                        >
                                          {" "}
                                          &#215;{" "}
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </Comment.Content>
                                </Comment>
                              ) : (
                                ""
                              )
                            )}
                          </Comment.Group>
                        ) : (
                          ""
                        )
                      )
                    : ""}
                  <AddComment addComment={this.addComment} />
                </Comment.Group>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default EventItem;

{
  /*  */
}
