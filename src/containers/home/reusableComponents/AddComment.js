import React, { Component, createRef } from "react";
import {
  Button,
  Form
} from "semantic-ui-react";

class AddComment extends Component {
  constructor(props) {
    super(props);
    this.toggleInputCase = this.toggleInputCase.bind(this);
  }

  toggleInputCase() {
    // Accessing the ref using this.inputField
    const value = this.inputField.value;
    console.log(value);
    if (value === "" || value === " ") return;
    this.props.addComment(value);
    this.inputField.value = "";
  }

  render() {
    return (
      <div style={{marginTop:"3em"}}>
        {/* Creating a callback ref and storing it in this.inputField */}
        {/*  */}
        <Form reply>
        <input type="text" ref={elem => (this.inputField = elem)} />
          <Button
            type="button"
            content="Add Comment"
            labelPosition="left"
            icon="edit"
            onClick={this.toggleInputCase}
            primary
          />
        </Form>
      </div>
    );
  }
}

export default AddComment;
