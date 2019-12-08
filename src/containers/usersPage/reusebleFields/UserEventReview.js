import React from "react";
import "../../../assets/css/eventItem.css";

import Participant from "../../home/reusableComponents/Participant";
import EventStarRating from "./EventStarRating";

export default function UserEventReview(props) {
  const { imageLink, user, rating, isFetchingRating } = props;

  return (
    <div
      style={{
        width: "100%",
        height: "100px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignContent:"center",
        justifyContent:"center",
        paddingTop:"5px",

      }}
    >
      <div style={{ wdith: "40%" }}>
        <Participant
          onClickUserIcon={props.onClickUserIcon}
          firstName={user.firstName}
          userId={user.userId}
          lastName={user.lastName}
          imageLink={imageLink}
        />
      </div>
      {console.log(rating)}
      {!isFetchingRating ? (
        <div style={{width:"40%"}}>
        <EventStarRating type="reviewList" rating={rating} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
