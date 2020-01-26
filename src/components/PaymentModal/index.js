import React, { Component } from 'react';
import { compose } from 'redux';
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
import Validator from 'components/Validator/Validator';
import { formatCurrency } from 'utils/formatCurrency';

import schema from './oneTimePaymentSchema';

class PaymentModal extends Component {
  state = {
    activeTab: 'one-time',
    seletedAccount: '',
    paymentAmount: '',
    dateValue: '',
    selectedPaymentAmount: '',
    customPaymentAmount: null,
  }

  handleActiveTab = (tab) => {
    this.setState({
      activeTab: tab,
    });
  }
  
  handleSelectPaymentAmount = (e) => {
    this.setState({
      selectedPaymentAmount: e.target.value,
    });
  }



  handleSelectChange = (e) => {
    this.setState({
      seletedAccount: e.target.value,
    });
  }
  handleInputChange = (e) => {
    const amount = e.target.value;
    var regex = /^\d+(\.\d{0,2})?$/g;

    if (amount === '' || regex.test(amount)) {
      this.setState({
        paymentAmount: amount,
      });
    }
  }

  handleDateChange = (e) => {
    this.setState({
      dateValue: e.target.value,
    });
  }

  handleButtonClick = () => {
    const { selectedPaymentAmount, paymentAmount: paymentAmountFromInput } = this.state;
    const selectedAccount = this.state.seletedAccount.split('-');
    const paymentMethodId = (selectedAccount[1] === 'savings' || selectedAccount[1] === 'checking') ? 4 : 3;

    const nextPaymentAmount = this.props.nextPaymentAmount ? `${this.props.nextPaymentAmount[0]}.${this.props.nextPaymentAmount[1]}` : '0.00';
    const pastDueAmount = this.props.pastDueAmount ? `${this.props.pastDueAmount[0]}.${this.props.pastDueAmount[1]}` : '0.00';
    const totalAmount = formatCurrency(Number(nextPaymentAmount) + Number(pastDueAmount), 2);

    let paymentAmount = '';
    switch (selectedPaymentAmount) {
      case '0':
        paymentAmount = totalAmount;
        break;
      case '1':
        paymentAmount = pastDueAmount;
        break;
      default:
        paymentAmount = paymentAmountFromInput;
    };

    const data = {
      "paymentMethodId": paymentMethodId,
      "amount": Number(paymentAmount),
      "date": this.state.dateValue,
      "paymentAccountId": Number(selectedAccount[0]),
    };

    this.props.putMakePayment(data);
    this.setState({
      seletedAccount:'',
      dateValue:'',
      paymentAmount: ''
    })
  }

  OneTimePayment = () => {
    const allPaymentMethods = [];
    if (this.props.paymentMethods) {
      this.props.paymentMethods.forEach((item) => {
        allPaymentMethods.push({
          value: `${item.paymentAccountId}-${item.type[2]}`,
          title: `${item.accountName} ending ${item.accountNumber.slice(-4)}`,
        });
      });
    }
    const nextPaymentAmount = this.props.nextPaymentAmount ? `${this.props.nextPaymentAmount[0]}.${this.props.nextPaymentAmount[1]}` : '0.00';
    const pastDueAmount = this.props.pastDueAmount ? `${this.props.pastDueAmount[0]}.${this.props.pastDueAmount[1]}` : '0.00';
    const totalAmount = formatCurrency(Number(nextPaymentAmount) + Number(pastDueAmount), 2);
    let currentDate = '';
    if (!this.state.dateValue) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      currentDate = `${yyyy}-${mm}-${dd}`;
      this.setState({dateValue: currentDate})
    }

    const paymentAmounts = [
      {
        title: `Total Due - $${totalAmount}`,
        value: '0'
      },
      {
        title: `Past Due - $${pastDueAmount}`,
        value: '1'
      },
      {
        title: 'Other Amount',
        value: '2'
      }
    ];

    return (
      <div>
        <Table className="mb-0" size="sm" responsive striped borderless>
          <tbody>
            <tr>
              <th scope="row" className="pl-3">Current Due</th>
              <td className="text-right pr-3">${nextPaymentAmount}</td>
            </tr>
            <tr>
              <th scope="row" className="pl-3">Past Due</th>
              <td className="text-right pr-3">${pastDueAmount}</td>
            </tr>
            <tr>
              <th scope="row" className="pl-3"><b>Total Due</b> by {this.props.nextPaymentDate}</th>
              <td className="text-right pr-3">${totalAmount}</td>
            </tr>
          </tbody>
        </Table>
        <ModalBody>
          <Select
            name="payFromAccount"
            data={allPaymentMethods}
            value={this.state.seletedAccount}
            onChange={this.handleSelectChange}
            label="Pay From Account"
            isRequired
          />
          <Input
            type="date"
            label="Payment Date"
            name="paymentDate"
            onChange={this.handleDateChange} 
            value={this.state.dateValue}
            isRequired
          />
          <Select
            name="paymentAmount"
            data={paymentAmounts}
            value={this.state.selectedPaymentAmount}
            onChange={this.handleSelectPaymentAmount}
            label="Payment Amount"
            isRequired
          />
          {
            this.state.selectedPaymentAmount === '2' && (
              <Input
                type="text"
                label="Payment Amount"
                name="customPaymentAmount"
                value={this.state.paymentAmount}
                onChange={this.handleInputChange}
                isRequired
              />
            )
          }
          <Button color="primary" className="w-100 mt-1" onClick={this.handleButtonClick}>Make Payment</Button>
        </ModalBody>
      </div>
    );
  }

  RecurringPayment = () => {
    return (
      <div>
        <Table className="mb-0" size="sm" responsive striped borderless>
          <tbody>
            <tr>
              <th scope="row" className="pl-3">Frequency</th>
              <td className="text-right pr-3">Monthly (Every 8th)</td>
            </tr>
            <tr>
              <th scope="row" className="pl-3">Next Date</th>
              <td className="text-right pr-3">September 9, 2019</td>
            </tr>
            <tr>
              <th scope="row" className="pl-3">Pay From</th>
              <td className="text-right pr-3"><strong>Chase Bank</strong> ending 1234</td>
            </tr>
            <tr>
              <th scope="row" className="pl-3">Pay Amount</th>
              <td className="text-right pr-3"><strong>$300.00</strong></td>
            </tr>
          </tbody>
        </Table>
        <ModalBody>
          <Row>
            <Col>
              <Button size="sm" className="w-100">Edit Payment</Button>
            </Col>
            <Col>
              <Button size="sm" className="w-100">Cancel Payments</Button>
            </Col>
          </Row>
        </ModalBody>
      </div>
    );
  }

  PayoffPayment = () => {
    return (
      <div>
        <ModalBody className="pt-0">
          <Select
            name="payFromAccount"
            data={[
              { value: 'paymentAccount1', title: 'Chase Bank ending 1234' },
              { value: 'newAccount', title: 'Add New Account' }
            ]}
            value={'paymentAccount1'}
            onChange={this.handleInputChange}
            label="Pay From Account"
            isRequired
            // hasError={!!formErrors.hasMerchant}
            // errorMessage={formErrors.hasMerchant}
          />
          <Select
            name="payoffDate"
            data={[
              { value: 'date1', title: 'September 21, 2019 – $2,484.12' },
              { value: 'date2', title: 'September 22, 2019 – $2,484.24' },
              { value: 'date3', title: 'September 23, 2019 – $2,484.36' },
              { value: 'date4', title: 'September 24, 2019 – $2,484.48' },
              { value: 'date5', title: 'September 25, 2019 – $2,484.60' },
              { value: 'date6', title: 'September 26, 2019 – $2,484.72' },
            ]}
            value={'paymentAccount1'}
            onChange={this.handleInputChange}
            label="Payoff Date & Amount"
            isRequired
            // hasError={!!formErrors.hasMerchant}
            // errorMessage={formErrors.hasMerchant}
          />
          <Button color="primary" className="w-100 mt-1" disabled>Review Payoff</Button>
        </ModalBody>
      </div>
    );
  }

  render() {
    const { activeTab } = this.state;
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="md">

        <ModalHeader className="no-border" toggle={this.props.toggle}>Make A Payment</ModalHeader>
        <ButtonGroup size="sm" className="d-flex ml-3 mr-3 mb-3">
          <Button color="primary" onClick={() => this.handleActiveTab('one-time')} active={activeTab === 'one-time' && true}>One-Time</Button>
          <Button color="primary" onClick={() => this.handleActiveTab('recurring')} active={activeTab === 'recurring' && true}>Recurring</Button>
          <Button color="primary" onClick={() => this.handleActiveTab('payoff')} active={activeTab === 'payoff' && true}>Payoff</Button>
        </ButtonGroup>

        { activeTab === 'one-time' && this.OneTimePayment() }
        { activeTab === 'recurring' && this.RecurringPayment() }
        { activeTab === 'payoff' && this.PayoffPayment() }


      </Modal>
    );
  }
}

export default compose(
  Validator(schema)
)(PaymentModal);
