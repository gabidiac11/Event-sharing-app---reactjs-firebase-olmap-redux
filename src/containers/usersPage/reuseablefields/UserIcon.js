import React from "react";
import "../../../assets/css/eventItem.css";
import { fromJSON } from "tough-cookie";
import "../../../assets/css/userIcon.css";

export default function UserIcon(props) {
  const { user, isActive, imageLink } = props;

  return (
    <div
      className="userContainer"
      onClick={props.setActiveProfile}
    >
      <img className="profileImage" src={imageLink} />
      <div className="fullName"> {`${user.firstName} ${user.lastName}`} </div>
    </div>
  );
}

