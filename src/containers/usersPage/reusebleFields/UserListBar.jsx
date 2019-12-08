import React, { Component } from "react";
import { Image, List, Button } from "semantic-ui-react";
import "../../../assets/css/UserListBar.css";

/*
=>aici tre sa am activeUser, userlist primite prin props
=>o methoda care sa 
*/

class UserListBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userListContainer: {
        height: "100%",
        transition: "height 2s"
      }
    };
  }

  changeHeightUSerList = index => {
    let newStyle = this.state.userListContainer;
    if (index === -1) {
      newStyle = { ...newStyle, height: "100%" };
    } else {
      newStyle = { ...newStyle, height: "100%" };
    }
    this.setState({ userListContainer: newStyle });
    this.props.setActiveProfile(index);
    
  };

  render() {
    const { activeUserIndex, isFetching, userList } = this.props;
    return (
      <div
        style={{
          width: "100%",
          marginBottom: "10px",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          className={`currentUser${
            activeUserIndex > -1 ? " showActiveUser" : ""
          }`}
        >
              <Button
                src="https://firebasestorage.googleapis.com/v0/b/fiipracticproiect.appspot.com/o/Zh6MY2P11VYgHc4FERv2Dy8AQq32%2F-LehzZxGiqw7PaMQHhOp?alt=media&token=cb584459-bfff-4254-8f1f-6c65394387c7"
                className="allEventsButton"
                onClick={() => this.changeHeightUSerList(-1)}
              >
                All Events
              </Button>
        </div>
        
        <div className={`user-list-container-overflow${
              activeUserIndex > -1 ? " collapsUserList" : ""
            }`}>
          <div
            style={this.state.userListContainer}
            className="userListContainer" 
          >
            <List
              selection
              animated
              verticalAlign="middle"
              style={{ width: "100%", height:"100%" }}
            >
              {!isFetching
                ? userList.map((item, index) => (
                    <List.Item
                      style={{
                        cursor: "pointer",
                        backgroundColor: "rba",
                        width: "100%",
                        overflow: 'hidden',
                        
                      }}
                      onClick={() => this.changeHeightUSerList(index)}
                    >
                      <Image
                        avatar
                        src={`${
                          item["image"]
                            ? item["image"].link
                            : "https://react.semantic-ui.com/images/wireframe/square-image.png"
                        }`}
                      />
                      <List.Content>
                        <List.Header>
                          {`${item.firstName} ${item.lastName}`}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  ))
                : ""}
            </List>
          </div>
        </div>
      </div>
    );
  }
}
export default UserListBar;

/*

order(userActive):userlist.length/2;
vecinii tre sa fie in mod egal de o parte si de alta

o sa fac un grup de elemente intr-un conainer intr-un numar fix
o sa l fac mare pe ala activ
cand da scroll o sa l invizibilizez pe ala de la inceput si-l vizibilizez pe ala ultim
si pun o transizitie cumva, poate merge
*/
