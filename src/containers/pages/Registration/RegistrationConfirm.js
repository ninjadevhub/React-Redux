import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import cn from "classnames";
import NotificationSystem from "react-notification-system";
import { signUp } from "utils/aws";
import Input from "components/Form/Input";
import Validator from "components/Validator/Validator";
import { ButtonLink, Button } from "components/Button";
import { Container, Row, Form, Col, Card, CardHeader, CardBody } from "reactstrap";

import schema from "./registrationConfirmSchema";

import style from "./style.scss";

class RegistrationConfirm extends Component {
  state = {
    redirectToReferrer: false,
    isLoading: false
  };

  handleInputChange = event => {
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
      formData["ssn"] = localStorage.getItem("user.ssn");
      formData["email"] = localStorage.getItem("user.email");
      this.setState({
        isLoading: true
      });
      const userCred = {
        payload: {
          username: formData.username,
          password: formData.password,
          attributes: {
            email: formData.email
          },
          clientMetadata: {
            ssn: formData.ssn
          }
        }
      };
      signUp(userCred)
        .then(res => {
          this.setState({ isLoading: false });
          this.notification.addNotification({
            message: 'Successfully Registered! ',
            level: 'success',
            position: 'tc',
          });
        })
        .catch(err => {
          this.setState({ isLoading: false });
          this.notification.addNotification({
            message: err.message,
            level: 'error',
            position: 'tc',
          });
        });
    }
  };

  signin = () => {
    this.props.history.push('/');
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const {
      validator: { values, errors }
    } = this.props;
    const { redirectToReferrer, isLoading } = this.state;
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div className="registration-page">
        <NotificationSystem
          ref={item => {
            this.notification = item;
          }}
        />
        <Container fluid>
          <Form onSubmit={(event) => this.handleSubmitFrom(event)}>
            <Row className="align-items-center" style={{ minHeight: "500px" }}>
              <Col lg={{ size: 3, offset: 4 }} md={{ size: 6, offset: 3 }}>
                <Card>
                  <CardHeader>New User Registration</CardHeader>
                  <CardBody>
                    <Row>
                      <Col>
                        <h5 className="mb-2 text-center">Create your username and password</h5>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Input
                          name="username"
                          label="Username"
                          value={values.username}
                          onChange={this.handleInputChange}
                          hasError={!!errors.username}
                          hasValue
                          placeHolder="username"
                          isBadgeVisible={false}
                          isRequired
                          errorMessage={errors.username}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Input
                          name="password"
                          type="password"
                          label="Password"
                          value={values.password}
                          onChange={this.handleInputChange}
                          hasError={!!errors.password}
                          hasValue
                          placeHolder="password"
                          isBadgeVisible={false}
                          isRequired
                          errorMessage={errors.password}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Input
                          name="confirmPassword"
                          label="Confirm Password"
                          onChange={this.handleInputChange}
                          value={values.confirmPassword}
                          hasError={!!errors.confirmPassword}
                          hasValue
                          placeHolder="Confirm Password"
                          isBadgeVisible={false}
                          isRequired
                          type="password"
                          errorMessage={errors.confirmPassword}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Button
                          className={cn("w-100", style.button)}
                          isLoading={isLoading}
                          color="primary"
                          type="submit"
                        >
                          Register
                        </Button>
                      </Col>
                    </Row>
                    <Row className="mt-1 text-center">
                      <Col style={{color:'#3989E3'}}>
                        <a onClick={this.signin}>Sign In</a>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

RegistrationConfirm.propTypes = {
  validator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  // signUp: PropTypes.func.isRequired,
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
)(RegistrationConfirm);
