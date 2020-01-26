import React, { Component } from 'react';
import get from "lodash/get";

import PropTypes from "prop-types";
import {
  ButtonGroup,
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Table
} from 'reactstrap';
import Select from 'components/Form/Select';
import Input from 'components/Form/Input';
import moment from 'moment';

class PaymentModal extends Component {
  state = {
    activeTab: 'checking'
  }

  handleActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  }

  componentDidMount() {
    window.addEventListener("message", this.receiveMessage, false);
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.receiveMessage, false);
  }

  iframeBody(){
    const obo_token = get(this.props.iframeURL, "data.token");
    return(
      <Row className="d-flex  justify-content-center align-items-center" style={{width:500, magin: 0 }}>
        <iframe
          title="pci-wallet"
          src={`https://pciwallet.simnang.com/api/check-capture-form/${obo_token}?account_type=${this.state.activeTab}`}
          style={{height:700, width: 400, border: "1 solid black" }}
          rameborder="0"
          border="0"
          cellSpacing="0"
        >
        </iframe>
      </Row>
    );
  }


  // USE it if u want handle iframe actions
  receiveMessage = event => {
    if (
      event.origin === "https://pciwallet.simnang.com" &&
      event.data.status == 200
    ) {
      const token = event.data.token;
      const time = new Date().getTime();
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const currentDate = `${mm}/${dd}/${yyyy}`;

      const data = {
        token: token,
        title: `AutoPay ${currentDate} ${time}`,
        accountType: this.state.activeTab    
       }
      this.props.saveToken(data)
    }
  };

  render() {
    const { activeTab } = this.state;
    
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="md">
        <ModalHeader className="no-border" toggle={this.props.toggle}>Add A Payment Method</ModalHeader>
        <ButtonGroup size="sm" className="d-flex ml-3 mr-3 mb-3">
          <Button color="primary" onClick={() => this.handleActiveTab('checking')} active={activeTab === 'checking' && true}>Checking</Button>
          <Button color="primary" onClick={() => this.handleActiveTab('savings')} active={activeTab === 'savings' && true}>Saving</Button>
          <Button color="primary" onClick={() => this.handleActiveTab('credit')} active={activeTab === 'credit' && true}>Debit Card</Button>
        </ButtonGroup>
        {this.iframeBody()}
      </Modal>
    );
  }
}

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  iframeURL: PropTypes.object.isRequired
};

export default PaymentModal;
