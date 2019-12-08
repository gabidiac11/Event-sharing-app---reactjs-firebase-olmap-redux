import React, { Component } from "react";
import "../../../assets/css/eventItem.css";

class EventStarRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startLink:
        "https://firebasestorage.googleapis.com/v0/b/fiipracticproiect.appspot.com/o/cl64UVW8ciWWTyEwFFx4OIRVP5D3%2F-LeJSNBIMZTeVN6KKsyY?alt=media&token=a0ca21bb-4935-42fa-abdf-206334d9c507",
      userStarLink:
        "https://firebasestorage.googleapis.com/v0/b/fiipracticproiect.appspot.com/o/cl64UVW8ciWWTyEwFFx4OIRVP5D3%2F-LeMgz48eMfJ8Kz8pGOQ?alt=media&token=09653e12-9dbb-4995-9834-50399b910454",
      userRatingHoverChange: 0,
      showAllReviews: false,
      hoverAllUserReviews: false
    };
  }

  selectUserRatingHover = starCount => {
    this.setState({
      userRatingHoverChange: starCount,
      userRatingHoverChange: starCount
    });
  };

  displayUsersReviews = () => {
    if (this.props.type === "allRatings") {
      const active = this.state.showAllReviews ? false : true;
      this.setState({ showAllReviews: active });
      this.props.displayUsersReviews(active);
    }
  };

  hoverOnAllUsersReview = show => {
    if (this.props.type === "allRatings") {
      this.setState({ hoverAllUserReviews: show });
    }
  };

  onSendRating = value => {
    if (this.props.type === "userRating") {
      console.log(value);
      this.props.onSendRating(value);
    }
  }

  render() {
    const { rating, type } = this.props;

    return (
      <div
        className={`starRatingContainer${
          this.state.showAllReviews || this.state.hoverAllUserReviews
            ? " highlightStarRating"
            : ""
        }`}
        onMouseOver={() => this.hoverOnAllUsersReview(true)}
        onMouseOut={() => this.hoverOnAllUsersReview(false)}
        onClick={() => this.displayUsersReviews()}
      >
        <div
          className={`starRating${
            type === "userRating"
              ? (this.state.userRatingHoverChange === 0 && rating >= 1) ||
                this.state.userRatingHoverChange >= 1
                ? " activeStarRating"
                : ""
              : rating >= 1
              ? " activeStarRating"
              : ""
          }`}
          onMouseOver={() => this.selectUserRatingHover(1)}
          onMouseOut={() => this.selectUserRatingHover(0)}
          onClick={() => this.onSendRating(1)}
        >
          <img
            src={`${
              type === "userRating"
                ? this.state.userStarLink
                : this.state.startLink
            }`}
          />
        </div>
        <div
          className={`starRating${
            type === "userRating"
              ? (this.state.userRatingHoverChange === 0 && rating >= 2) ||
                this.state.userRatingHoverChange >= 2
                ? " activeStarRating"
                : ""
              : rating >= 2
              ? " activeStarRating"
              : ""
          }`}
          onMouseOver={() => this.selectUserRatingHover(2)}
          onMouseOut={() => this.selectUserRatingHover(0)}
          onClick={() => this.onSendRating(2)}
        >
          <img
            src={`${
              type === "userRating"
                ? this.state.userStarLink
                : this.state.startLink
            }`}
          />
        </div>
        <div
          className={`starRating${
            type === "userRating"
              ? (this.state.userRatingHoverChange === 0 && rating >= 3) ||
                this.state.userRatingHoverChange >= 3
                ? " activeStarRating"
                : ""
              : rating >= 3
              ? " activeStarRating"
              : ""
          }`}
          onMouseOver={() => this.selectUserRatingHover(3)}
          onMouseOut={() => this.selectUserRatingHover(0)}
          onClick={() => this.onSendRating(3)}
        >
          <img
            src={`${
              type === "userRating"
                ? this.state.userStarLink
                : this.state.startLink
            }`}
          />
        </div>
        <div
          className={`starRating${
            type === "userRating"
              ? (this.state.userRatingHoverChange === 0 && rating >= 4) ||
                this.state.userRatingHoverChange >= 4
                ? " activeStarRating"
                : ""
              : rating >= 4
              ? " activeStarRating"
              : ""
          }`}
          onMouseOver={() => this.selectUserRatingHover(4)}
          onMouseOut={() => this.selectUserRatingHover(0)}
          onClick={() => this.onSendRating(4)}
        >
          <img
            src={`${
              type === "userRating"
                ? this.state.userStarLink
                : this.state.startLink
            }`}
          />
        </div>
        <div
          className={`starRating${
            type === "userRating"
              ? (this.state.userRatingHoverChange === 0 && rating >= 5) ||
                this.state.userRatingHoverChange >= 5
                ? " activeStarRating"
                : ""
              : rating >= 5
              ? " activeStarRating"
              : ""
          }`}
          onMouseOver={() => this.selectUserRatingHover(5)}
          onMouseOut={() => this.selectUserRatingHover(0)}
          onClick={() => this.onSendRating(5)}
        >
          <img
            src={`${
              type === "userRating"
                ? this.state.userStarLink
                : this.state.startLink
            }`}
          />
        </div>
      </div>
    );
  }
}

export default EventStarRating;
