import React from "react";
import "../../../assets/css/eventItem.css";

export default function AnImage(props) {
  const { imageLink, transformProp } = props;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: "0",
        left: "0",
        transform: transformProp,
        transitionDuration: "1s",
        opacity: "1",
        backgroundImage: `url('${imageLink}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        backgroundSize: "contain",
      }}
    > 
    </div>
  );
}
