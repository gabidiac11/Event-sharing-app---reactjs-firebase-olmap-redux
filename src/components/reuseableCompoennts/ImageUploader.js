import React, { Component } from "react";
// import {storage} from '../../config/FireConfig'
import "../../assets/css/imagesModal.css";

class ImageUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ padding: "5px" }}>
        <input
          className="myButton"
          type="file"
          onChange={this.props.handleChangeImage}
        />

        {this.props.imageFetching ? (
          <img
            src="https://i.gifer.com/7plQ.gif"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <button className="myButton" onClick={this.props.uploadImage}>
            Upload
          </button>
        )}
      </div>
    );
  }
}

export default ImageUploader;
