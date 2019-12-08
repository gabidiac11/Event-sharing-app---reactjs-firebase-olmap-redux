import React, { Component } from "react";
import firebaseProvider from "../../config/FireConfig";
import "../../assets/css/imagesModal.css";
// import {storage} from '../../config/FireConfig'

class ImagesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalStyling: {
        display: "none" /* Hidden by default */,
        position: "fixed" /* Stay in place */,
        zIndex: "1" /* Sit on top */,
        paddingTop: "100px" /* Location of the box */,
        left: "0",
        top: "0",
        width: "100%" /* Full width */,
        height: "100%" /* Full height */,
        overflow: "auto" /* Enable scroll if needed */,
        backgroundColor: "rgb(0,0,0)" /* Fallback color */,
        backgroundColor: "rgba(0,0,0,0.9)" /* Black w/ opacity */
      }
    };
  }

  showModal = ev => {
    let modalStyling = { ...this.state.modalStyling, display: "block" };
    this.setState({ modalStyling: modalStyling });
  };

  hideModal = () => {
    let modalStyling = { ...this.state.modalStyling, display: "none" };
    this.setState({ modalStyling: modalStyling });
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "red",
          display: "flex",
          width: "30%",
          float: "left"
        }}
      >
        <div style={{ display: "flex", position: "relative" }}>
          <img
            id="myImg"
            src={this.props.imageLink}
            style={{ width: "100%", height: "100%" }}
            onClick={this.showModal}
          />
          <span
            class="removeImage"
            onClick={e => this.props.removeImage(this.props.imageLink)}
          >
            &times;
          </span>
        </div>

        <div style={this.state.modalStyling}>
          <span class="close" onClick={this.hideModal}>
            &times;
          </span>
          <img class="modal-content" id="img01" src={this.props.imageLink} />
        </div>
      </div>
    );
  }
}

export default ImagesModal;
