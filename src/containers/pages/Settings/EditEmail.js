import React, { Component } from 'react';
import {
  Button,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import Input from 'components/Form/Input';

class EditEmail extends Component {
  state = {
    disabled: true
  }

  handleValueChange = () => {
    this.setState({ disabled: false })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="md">
        <ModalHeader toggle={this.props.toggle}>Edit Email Address</ModalHeader>
        <ModalBody>

          <Input
            type="email"
            name="email-address"
            label="Email Address"
            id="emailAddress"
            defaultValue="kylefoundry@gmail.com"
            onChange={this.handleValueChange}
          />

          <Button color="primary" className="w-100" disabled={this.state.disabled}>Save</Button>

        </ModalBody>
      </Modal>
    );
  }
}

export default EditEmail;
