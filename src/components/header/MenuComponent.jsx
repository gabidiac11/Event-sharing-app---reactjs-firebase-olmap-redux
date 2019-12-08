import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

export default class MenuComponent extends Component {
    state = { activeItem: this.props.page };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const { activeItem } = this.state;

        return (
            <div id="menuBarHeader">
                <Menu pointing secondary color="orange">
                    <Menu.Item
                        as={Link}
                        to="/home"
                        name="home"
                        active={this.state.activeItem === "home"}
                        onClick={this.handleItemClick}
                    >
                        Home
                    </Menu.Item>

                    <Menu.Item
                        as={Link}
                        to="/users"
                        name="users"
                        active={this.state.activeItem === "users"}
                        onClick={this.handleItemClick}
                    >
                        Users
                    </Menu.Item>

                </Menu>


            </div>

            
        );
    }
}
