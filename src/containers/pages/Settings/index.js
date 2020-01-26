import React, { Component } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row } from 'reactstrap';
import Switch from 'react-switch';

import EditEmail from './EditEmail';
import EditPhoneHome from './EditPhoneHome';
import EditPhoneMobile from './EditPhoneMobile';
import EditPhoneWork from './EditPhoneWork';
import EditMailingAddress from './EditMailingAddress';
import EditPassword from './EditPassword';
import EditPhysicalAddress from './EditPhysicalAddress';
import EditUsername from './EditUsername';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class ConsumerSettings extends Component {
  state = {
    checked: true,
    modalEmail: false,
    modalHome: false,
    modalMobile: false,
    modalMailingAddress: false,
    modalPassword: false,
    modalPhysicalAddress: false,
    modalUsername: false,
    modalWork: false,
    mailAddress:[],
    primaryAddress:[],
    phones:[],
    email:''
  }

  componentDidMount() {
    const customerDetail = JSON.parse(localStorage.getItem('customerDetail'));

    const mailAddress = customerDetail.mailAddress
    const primaryAddress = customerDetail.primaryAddress;
    const phones = customerDetail.phones[0];
    const email = customerDetail.email;
    this.setState({ mailAddress, primaryAddress, phones, email });
  }

  openModal = (modal) => {
    this.setState( prevState => ({ [modal]: true }) );
  }

  closeModal = (modal) => {
    this.setState( prevState => ({ [modal]: false }) );
  }

  handleCheck = (checked) => {
    this.setState({ checked });
  }

  render() {
    const {
      modalEmail,
      modalHome,
      modalMobile,
      modalMailingAddress,
      modalPassword,
      modalPhysicalAddress,
      modalUsername,
      modalWork
    } = this.state;
    return (
      
      <div className="page-documents pb-3">
        <Container fluid>

          <Row className="mb-3 align-items-center">
            <Col className="text-center text-md-left">
              <h3 className="mb-0">Accout Settings</h3>
            </Col>
          </Row>

          <Row>
            <Col md={6} lg={4}>
              <Card>
                <CardHeader>Username &amp; Password</CardHeader>
                <ListGroup className="btn-list">
                  <ListGroupItem>
                    <Row className="align-items-center">
                      <Col xs="auto"><h5 className="mb-0">Username</h5></Col>
                      <Col className="text-right">kylefoundry</Col>
                      <Col xs="auto" className="px-0">
                        <Button color="link" className="btn-icon" onClick={() => this.openModal('modalUsername')}>
                          <img src="/icons/edit.svg" alt="Edit" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row className="align-items-center">
                      <Col xs="auto"><h5 className="mb-0">Password</h5></Col>
                      <Col className="text-right">*************</Col>
                      <Col xs="auto" className="px-0">
                        <Button color="link" className="btn-icon" onClick={() => this.openModal('modalPassword')}>
                          <img src="/icons/edit.svg" alt="Edit" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Card>

              

            </Col>
            <Col md={6} lg={4}>

            <Card>
                <CardHeader>Account Addresses</CardHeader>
                <CardBody className="position-relative">
                  <h6>Physical Address</h6>
                  <p className="mb-0">{this.state.primaryAddress.address1}<br />
                  {this.state.primaryAddress.city}, {this.state.primaryAddress.state} {this.state.primaryAddress.zipcode}</p>
                  <Button
                    color="link"
                    className="btn-icon position-absolute"
                    style={{ top: 40, right: 13 }}
                    onClick={() => this.openModal('modalPhysicalAddress')}
                  >
                    <img src="/icons/edit.svg" alt="Edit" />
                  </Button>
                </CardBody>
                <CardBody className="position-relative">
                  <h6>Mailing Address</h6>
                  <p className="mb-0">{this.state.mailAddress.address1}<br />
                  {this.state.mailAddress.city}, {this.state.mailAddress.state} {this.state.mailAddress.zipcode}</p>
                  <Button
                    color="link"
                    className="btn-icon position-absolute"
                    style={{ top: 40, right: 13 }}
                    onClick={() => this.openModal('modalMailingAddress')}
                  >
                    <img src="/icons/edit.svg" alt="Edit" />
                  </Button>
                </CardBody>
              </Card>

            </Col>
            <Col md={6} lg={4}>

            <Card>
                <CardHeader>Contact Information</CardHeader>
                <ListGroup className="btn-list">
                  <ListGroupItem>
                    <Row className="align-items-center">
                      <Col xs="auto"><h5 className="mb-0">Mobile</h5></Col>
                      <Col className="text-right">
                        <strong className="text-primary mr-1">Primary</strong>
                        {this.state.phones.phone}
                      </Col>
                      <Col xs="auto" className="px-0">
                        <Button color="link" className="btn-icon" onClick={() => this.openModal('modalMobile')}>
                          <img src="/icons/edit.svg" alt="Edit" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row className="align-items-center">
                      <Col xs="auto"><h5 className="mb-0">Home</h5></Col>
                      <Col className="text-right">{this.state.phones.phone}</Col>
                      <Col xs="auto" className="px-0">
                        <Button color="link" className="btn-icon" onClick={() => this.openModal('modalHome')}>
                          <img src="/icons/edit.svg" alt="Edit" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row className="align-items-center">
                      <Col xs="auto"><h5 className="mb-0">Work</h5></Col>
                      <Col className="text-right">{this.state.phones.phone}</Col>
                      <Col xs="auto" className="px-0">
                        <Button color="link" className="btn-icon" onClick={() => this.openModal('modalWork')}>
                          <img src="/icons/edit.svg" alt="Edit" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem>
                    <Row className="align-items-center">
                      <Col xs="auto"><h5 className="mb-0">Email</h5></Col>
                      <Col className="text-right">{this.state.email}</Col>
                      <Col xs="auto" className="px-0">
                        <Button color="link" className="btn-icon" onClick={() => this.openModal('modalEmail')}>
                          <img src="/icons/edit.svg" alt="Edit" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>

        </Container>

        <EditEmail isOpen={modalEmail} toggle={() => this.closeModal('modalEmail')} />
        <EditPhoneHome isOpen={modalHome} toggle={() => this.closeModal('modalHome')} />
        <EditPhoneMobile isOpen={modalMobile} toggle={() => this.closeModal('modalMobile')} />
        <EditPhoneWork isOpen={modalWork} toggle={() => this.closeModal('modalWork')} />
        <EditMailingAddress isOpen={modalMailingAddress} toggle={() => this.closeModal('modalMailingAddress')} />
        <EditPassword isOpen={modalPassword} toggle={() => this.closeModal('modalPassword')} />
        <EditPhysicalAddress isOpen={modalPhysicalAddress} toggle={() => this.closeModal('modalPhysicalAddress')} />
        <EditUsername isOpen={modalUsername} toggle={() => this.closeModal('modalUsername')} />

      </div>
    );
  }
}


const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ConsumerSettings);