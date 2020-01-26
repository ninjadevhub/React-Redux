import React, { Component } from 'react';
import {
  Button,
  CustomInput,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import NumberFormat from 'react-number-format';

import Input from 'components/Form/Input';

class EditPhoneMobile extends Component {
  state = {
    disabled: true
  }

  handleValueChange = () => {
    this.setState({ disabled: false })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="md">
        <ModalHeader toggle={this.props.toggle}>Edit Mobile Number</ModalHeader>
        <ModalBody>
          <Input
            label="Mobile Number"
            type="tel"
            name="mobile-number"
            id="mobileNumber"
            tag={NumberFormat}
            format="(###) ###-####"
            defaultValue="5551234567"
            onChange={this.handleValueChange}
          />
          <FormGroup className="mb-3" check>
            <CustomInput
              type="checkbox"
              name="check"
              id="Check"
              label="Set as primary number"
              onChange={this.handleValueChange}
              defaultChecked
            />
          </FormGroup>

          <h5>How can we contact you?</h5>

          <FormGroup className="mb-4">
            <CustomInput type="radio" id="contactPreference1" name="contactRadio" label="Call me or text me through automated means" onChange={this.handleValueChange} defaultChecked />
            <CustomInput type="radio" id="contactPreference2" name="contactRadio" label="Only contact me through non-automated means" onChange={this.handleValueChange} />
          </FormGroup>

          <Button color="primary" className="w-100" disabled={this.state.disabled}>Save</Button>

        </ModalBody>
      </Modal>
    );
  }
}

export default EditPhoneMobile;
