import React from "react";
import "../../../assets/css/participant.css";

export default function Participant(props) {
  const { imageLink, firstName, lastName, userId } = props;

  return (
    <div
      style={{width:"50px", height:"50px", margin:"10px", cursor:"pointer"}}
      onClick={props.onClickUserIcon}
    >
      <div className="tooltip">
        <img src={imageLink} className="profileImage" />
        <span className="tooltiptext">{`${firstName} ${lastName}`}</span>
      </div>
    </div>
  );
}
