import React, { Component } from 'react';
import {
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
} from 'reactstrap';

import Select from 'components/Form/Select';
import Input from 'components/Form/Input';

class EditMailingAddress extends Component {
  state = {
    disabled: true
  }

  handleValueChange = () => {
    this.setState({ disabled: false })
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="md">
        <ModalHeader toggle={this.props.toggle}>Edit Mailing Address</ModalHeader>
        <ModalBody>

          <Input
            label="Address Line 1"
            name="addressLine1"
            // value={'values.applicant && values.applicant.lastName'}
            onChange={this.handleValueChange}
            // onBlur={this.handleBlur}
            isRequired
            // hasError={!!formErrors['applicant.lastName']}
            // errorMessage={formErrors['applicant.lastName']}
          />

          <Input
            label="Address Line 2"
            name="addressLine2"
            // value={'values.applicant && values.applicant.lastName'}
            onChange={this.handleValueChange}
            // onBlur={this.handleBlur}
            isRequired
            // hasError={!!formErrors['applicant.lastName']}
            // errorMessage={formErrors['applicant.lastName']}
          />

          <Input
            label="City"
            name="addressCity"
            // value={'values.applicant && values.applicant.lastName'}
            onChange={this.handleValueChange}
            // onBlur={this.handleBlur}
            isRequired
            // hasError={!!formErrors['applicant.lastName']}
            // errorMessage={formErrors['applicant.lastName']}
          />

          <Row>
            <Col xs={6}>
              <Select
                name="addressState"
                data={[
                  { value: 'California', title: 'California' },
                  { value: 'Illinois', title: 'Illinois' }
                ]}
                value={'California'}
                onChange={this.handleInputChange}
                label="State"
                isRequired
                // hasError={!!formErrors.hasMerchant}
                // errorMessage={formErrors.hasMerchant}
              />
            </Col>
            <Col xs={6} className="pl-0">
              <Input
                type="tel"
                name="addressZip"
                onChange={this.handleInputChange}
                label="Zip Code"
                isRequired
                mask={Number}
                // hasError={!!formErrors.hasMerchant}
                // errorMessage={formErrors.hasMerchant}
              />
            </Col>
          </Row>

          <Button color="primary" className="w-100 mt-1" disabled={this.state.disabled}>Save</Button>

        </ModalBody>
      </Modal>
    );
  }
}

export default EditMailingAddress;
