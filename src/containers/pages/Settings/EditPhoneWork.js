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

class EditPhoneWork extends Component {
  state = {
    disabled: true
  }

  handleValueChange = () => {
    this.setState({ disabled: false })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="md">
        <ModalHeader toggle={this.props.toggle}>Edit Work Number</ModalHeader>
        <ModalBody>

          <Input
            type="tel"
            name="work-number"
            id="workNumber"
            label="Work Number"
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
            />
          </FormGroup>

          <Button color="primary" className="w-100" disabled={this.state.disabled}>Save</Button>

        </ModalBody>
      </Modal>
    );
  }
}

export default EditPhoneWork;
