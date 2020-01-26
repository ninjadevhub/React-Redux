import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import Input from 'components/Form/Input';
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import cn from "classnames";
import NotificationSystem from "react-notification-system";
import { changePassword } from "utils/aws";
import Validator from "components/Validator/Validator";
import { ButtonLink, Button } from "components/Button";
import { Container, Row, Form, Col } from "reactstrap";

import schema from "./changepasswordSchema";

class EditPassword extends Component {
  state = {
    disabled: true
  }

  handleValueChange = () => {
    this.setState({ disabled: false })
  }

  state = {
    redirectToReferrer: false,
    isLoading: false
  };

  handleInputChange = event => {
    this.setState({ disabled: false })
    const {
      validator: { onChangeHandler }
    } = this.props;
    const value = event.target.value.trim();
    onChangeHandler(event.target.name, value);
  };

  handleSubmitFrom = (e) => {
    e.preventDefault();
    const {
      validator: { validate, values }
    } = this.props;
    if (validate(schema).isValid) {
      const formData = values;
      this.setState({
        isLoading: true
      });
      changePassword(formData)
        .then(res => {
          this.setState({ isLoading: false });
          this.notification.addNotification({
            message: 'Successfully Changed! ',
            level: 'success',
            position: 'tc',
          });
        })
        .catch(err => {
          console.log(err)
          this.setState({ isLoading: false });
          this.notification.addNotification({
            message: err.message,
            level: 'error',
            position: 'tc',
          });
        });
    }
  };


  render() {
    const {
      validator: { values, errors }
    } = this.props;
    const { isLoading } = this.state;

    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="md">
        <ModalHeader toggle={this.props.toggle}>Change Password</ModalHeader>
        <ModalBody>
          <NotificationSystem
            ref={item => {
              this.notification = item;
            }}
          />
          <Container fluid>
            <Form onSubmit={(event) => this.handleSubmitFrom(event)}>
              <Input
                name="currentpassword"
                type="password"
                label="Current Password"
                value={values.currentpassword}
                onChange={this.handleInputChange}
                hasError={!!errors.password}
                hasValue
                placeHolder="password"
                isBadgeVisible={false}
                isRequired
                errorMessage={errors.password}
              />
              <Input
                name="password"
                type="password"
                label="New Password"
                value={values.password}
                onChange={this.handleInputChange}
                hasError={!!errors.password}
                hasValue
                placeHolder="password"
                isBadgeVisible={false}
                isRequired
                errorMessage={errors.password}
              />
              <Input
                name="confirmPassword"
                label="Retype New Password"
                onChange={this.handleInputChange}
                value={values.confirmPassword}
                hasError={!!errors.confirmPassword}
                hasValue
                placeHolder="Retype New Password"
                isBadgeVisible={false}
                isRequired
                type="password"
                errorMessage={errors.confirmPassword}
              />
              <Button color="primary" type="submit" className="w-100 mt-1" isLoading={isLoading} disabled={this.state.disabled}>Change Password</Button>
            </Form>
          </Container>
        </ModalBody>
      </Modal>
    );
  }
}

EditPassword.propTypes = {
  validator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  Validator(schema),
  connect(
    state => ({
      auth: state.auth
    }),
    null
  )
)(EditPassword);