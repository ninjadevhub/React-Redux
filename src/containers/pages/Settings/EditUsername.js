import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

import Input from 'components/Form/Input';

class EditUsername extends Component {
  state = {
    disabled: true
  }

  handleValueChange = () => {
    this.setState({ disabled: false })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="md">
        <ModalHeader toggle={this.props.toggle}>Change Username</ModalHeader>
        <ModalBody>

          <Input
            label="Current Username"
            name="currentUsername"
            // value={'values.applicant && values.applicant.lastName'}
            onChange={this.handleValueChange}
            // onBlur={this.handleBlur}
            isRequired
            // hasError={!!formErrors['applicant.lastName']}
            // errorMessage={formErrors['applicant.lastName']}
          />

          <Input
            label="New Username"
            name="newUsername"
            // value={'values.applicant && values.applicant.lastName'}
            onChange={this.handleValueChange}
            // onBlur={this.handleBlur}
            isRequired
            // hasError={!!formErrors['applicant.lastName']}
            // errorMessage={formErrors['applicant.lastName']}
          />

          <Input
            type="password"
            label="Current Password"
            name="currentPassword"
            // value={'values.applicant && values.applicant.lastName'}
            onChange={this.handleValueChange}
            // onBlur={this.handleBlur}
            isRequired
            // hasError={!!formErrors['applicant.lastName']}
            // errorMessage={formErrors['applicant.lastName']}
          />

          <Button color="primary" className="w-100 mt-1" disabled={this.state.disabled}>Change Username</Button>

        </ModalBody>
      </Modal>
    );
  }
}

export default EditUsername;
