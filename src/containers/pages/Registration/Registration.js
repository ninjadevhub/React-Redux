import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import cn from "classnames";
import NotificationSystem from "react-notification-system";

import Input from "components/Form/Input";
import Validator from "components/Validator/Validator";
import { ButtonLink, Button } from "components/Button";

import { Container, Row, Form, Col, Card, CardHeader, CardBody, } from "reactstrap";

import schema from "./registrationSchema";

import style from "./style.scss";

import { appConfig } from "config/appConfig";

class Registration extends Component {
  state = {
    redirectToReferrer: false,
    error: "",
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
      localStorage.setItem("user.ssn", values.ssn);
      localStorage.setItem("user.email", values.email);
      // next page
      this.setState({ ssn: values.ssn, email: values.email, isFirstStep: false });
      this.props.history.push("/registration-confirm");
    } else {
      // console.log("api error");
    }
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const {
      validator: { values, errors }
    } = this.props;
    const { error, redirectToReferrer, isLoading } = this.state;

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
                        <h5 className="mb-2 text-center">
                          Enter the information below to verify your identity
                        </h5>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Input
                          name="ssn"
                          label="Ssn"
                          value={values.ssn}
                          onChange={this.handleInputChange}
                          hasError={!!errors.ssn}
                          hasValue
                          placeHolder="type ssn"
                          isBadgeVisible={false}
                          isRequired
                          errorMessage={errors.ssn}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Input
                          name="email"
                          type="email"
                          label="Email"
                          value={values.email}
                          onChange={this.handleInputChange}
                          hasError={!!errors.email}
                          hasValue
                          placeHolder="email"
                          isBadgeVisible={false}
                          isRequired
                          errorMessage={errors.email}
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
                          Next >>
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label className={style.registrationError}>
                          {error.message}
                        </label>
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

Registration.propTypes = {
  validator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
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
)(Registration);
