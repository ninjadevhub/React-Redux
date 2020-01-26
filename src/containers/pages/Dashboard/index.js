import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';
import moment from 'moment';
import get from 'lodash/get';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  FormGroup,
  Input,
  Row,
  Table,
} from 'reactstrap';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  selectLoanId,
  fetchLoanDetail,
  fetchPaymentsList,
  fetchTransactionsList,
  fetchDocuments,
  fetchLoanTerm,
  makePayment,
  fetchPaymentMethods
} from 'actions/dashboard';
import PaymentModal from 'components/PaymentModal';
import { formatCurrency } from 'utils/formatCurrency';

class Dashboard extends Component {
  state = {
    latePayments: 0,
    modal: false,
    activeLoanId:'',
    message:[{
      success:'',
      error:''
    }],
  }

  componentDidMount() {
    const { loansList } = this.props;
    this.props.fetchLoanTerm(loansList.activeLoanId);
    this.props.fetchLoanDetail(loansList.activeLoanId);
    this.props.fetchPaymentsList(loansList.activeLoanId);
    this.setState({ activeLoanId: loansList.activeLoanId });
  }

  componentWillUnmount() {
    sessionStorage.setItem('visitedDashboard', true);
  }

  componentDidUpdate(prevProps) {
    const { makePaymentMessage } = this.props;
    
    if(!makePaymentMessage.isLoading && makePaymentMessage !== prevProps.makePaymentMessage){
      if(makePaymentMessage.error){
        this.notification.addNotification({
          message: makePaymentMessage.error.data.title,
          level: 'error',
          position: 'tc',
        });
      }
      else{
        this.notification.addNotification({
          message: 'Payment was successfully submitted',
          level: 'success',
          position: 'tc',
        });
      }
    }
   }

  handleModal = () => {
    if (!this.props.paymentMethods.isLoading && !this.props.paymentMethods.data){
      this.props.fetchPaymentMethods({
        success: (res) => {
          this.setState(prevState => ({
            modal: !prevState.modal,
          }));
        }
      });
    } else {
      this.setState(prevState => ({
        modal: !prevState.modal,
      }));
    }
  }

  handleChange = (e) => {
    this.setState({activeLoanId : e.target.value});
    this.props.fetchLoanDetail(e.target.value);
    // this.props.fetchPaymentsList(e.target.value);
    this.props.fetchTransactionsList(e.target.value);
    // this.props.fetchDocuments(e.target.value);
    this.props.fetchLoanTerm(e.target.value)
    this.props.selectLoanId(e.target.value);
  }

  putMakePayment = (data) => {
    this.props.makePayment({data:data, loanId:this.state.activeLoanId});
  }

  render() {
    const {modal } = this.state;
    const { loansList, loanDetail, loanTerm, paymentsList, paymentMethods } = this.props;
    const customerDetail = JSON.parse(localStorage.getItem('customerDetail'));
    const allpaymentmethods = [];
    paymentMethods.data && paymentMethods.data.forEach((item) => {
      if(item.checkingAccount.bankName && item.checkingAccount.accountNumber){
        allpaymentmethods.push({accountName: item.checkingAccount.bankName, accountNumber:item.checkingAccount.accountNumber, paymentAccountId: item.id, type:item.checkingAccount.accountType.split('.')})
      }
      if(item.creditCard.cardType && item.creditCard.cardNumber){
        allpaymentmethods.push({accountName: item.creditCard.cardType, accountNumber:item.creditCard.cardNumber, paymentAccountId:item.id, type:item.creditCard.cardType.split('.')})
      }
    })
    const pastDue = Number(get(loanDetail, 'data.0.daysPastDue', 0));
    const latePayments = pastDue > 0 ? 2 : 0;
    // session
    const visitedDashboard = sessionStorage.getItem('visitedDashboard');
    
    // data parsing
    const payments = get(paymentsList, 'data', []);
    const customerName = `${get(customerDetail, 'firstName')} ${get(customerDetail, 'lastName')}`;
    const periodRemaining = Number(get(loanDetail, 'data.0.periodsRemaining', 0));
    
    const totalPayments = Number(get(loanTerm, 'data.loanTerm', 0));
    const principalBalance = formatCurrency(get(loanDetail, 'data.0.principalBalance', 0), 2).split('.');
    const nextPaymentAmount = formatCurrency(get(loanDetail, 'data.0.nextPaymentAmount', 0), 2).split('.');
    const pastDueAmount = formatCurrency(get(loanDetail, 'data.0.amountDue'), 2).split('.');
    const nextPaymentDate = moment(new Date(get(loanDetail, 'data.0.nextPaymentDate', ''))).format('MM/DD/YYYY').toString();
    const activeloanId = this.state.activeLoanId;
    // initialize graph
    const paymentData = [{ name: 'Payments', paid: totalPayments - periodRemaining, late: latePayments }];
    
    return (
      <div className={ `page-dashboard ${ visitedDashboard ? 'noAnimations' : '' }` }>
        <NotificationSystem ref={(item) => { this.notification = item; }} />
        <Container fluid>

          <Row className="mb-3 align-items-center">
            <Col className="text-center text-md-left">
              <h3 className="mb-0">Welcome, {customerName}!</h3>
              <small><strong>Customer ID:&nbsp;</strong> {get(customerDetail, 'customId')}</small>
            </Col>
            <Col xs={12} md="auto" className="mt-3 mt-md-0">
              { pastDue > 0 ?
                <Row>
                  <Col xs="auto" className="pr-0">
                    <img src="/icons/consumer-status-pastdue.svg" alt="Past Due" />
                  </Col>
                  <Col>
                    <h5 className="mb-0">Call 800-994-6177 or Make A Payment</h5>
                    <small>Avoid negative impact on your credit</small>
                  </Col>
                </Row>
                :
                <Row>
                  <Col xs="auto" className="pr-0">
                    <img src="/icons/consumer-status-current.svg" alt="Current" />
                  </Col>
                  <Col>
                    <h5 className="mb-0">Great work {customerName && customerName.split(' ')[0]}!</h5>
                    <small>You are up to date with your payments</small>
                  </Col>
                </Row>
              }
            </Col>
            <Col xs={12} md="auto" className="text-right justify-content-end ml-md-3 mt-3 mt-md-0">
              <FormGroup className="dropdown-toggle mb-0 input-inline pb-0">
                <Input type="select" name="select" id="loanSelection" onChange={this.handleChange} value={activeloanId}>
                  <option disabled>Select</option>
                  {
                    loansList.data && loansList.data.map((item, index) => (
                      <option value={item.id} key={`loanlist_${index}`}>{item.displayId}</option>
                    ))
                  }
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6} lg={4}>

              <Card inverse color="primary">
                <CardHeader>Personal Loan</CardHeader>
                <CardBody className="text-center">
                  {
                    loanDetail.data ?
                      <h1 style={{ fontSize: 3 + 'rem' }}>${principalBalance[0]}.<small>{principalBalance[1]}</small></h1>
                    :
                      <h1 style={{ fontSize: 3 + 'rem' }}>-</h1>
                  }
                  <h6>Principal Balance</h6>
                  <Row className="mt-4">
                    <Col className="pr-0">
                      <Card className="pt-2 pb-2">
                        <h6>Due by {loanDetail.data ? nextPaymentDate : '-'}</h6>
                        {
                          loanDetail.data ?
                            <h3 className="mb-0">${nextPaymentAmount[0]}.<small>{nextPaymentAmount[1]}</small></h3>
                          :
                          <h3 className="mb-0">-</h3>
                        }
                      </Card>
                    </Col>
                    <Col>
                      <Card className={`pt-2 pb-2 ${ pastDue > 0 ? 'bg-white' : '' }`}>
                        <h6 className={ pastDue > 0 ? 'text-danger' : '' }>Past Due</h6>
                        {
                          loanDetail.data ?
                            <h3 className={ `mb-0 ${ pastDue > 0 ? 'text-danger' : '' }` }>
                              ${pastDueAmount[0]}.<small className={ `${ pastDue > 0 ? 'text-danger' : '' }` }>{pastDueAmount[1]}</small>
                            </h3>
                          :
                            <h3 className={ 'mb-0' }>
                              -
                            </h3>
                        }
                      </Card>
                    </Col>
                  </Row>
                  <Button color="light" outline className="w-100 mb-1">
                    <img src="/icons/autopay.svg" alt="" className="mr-1" />
                    Set Up Autopay
                  </Button>
                  <Button color="light" className="w-100" onClick={this.handleModal}>
                    <img src="/icons/payment.svg" alt="" className="mr-1" />
                    Make A Payment
                  </Button>
                </CardBody>
              </Card>

            </Col>
            <Col md={6} lg={8}>

              <Card>
                <CardHeader className="text-left">
                  Loan Tracker
                    <a onClick={this.handleModal} className={`float-right ${ pastDue > 0 ? 'text-danger' : '' }`}><span fontColor="blue">Make A Payment</span></a>
                </CardHeader>
                <CardBody className="pt-2">
                  <ResponsiveContainer width="100%" height={30}>
                    <BarChart
                      data={paymentData}
                      layout="vertical"
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                      height={15}
                      barSize={15}
                    >
                      <XAxis type="number" height={0} domain={[0, totalPayments]} />
                      <YAxis dataKey="name" type="category" width={0} />
                      <Bar dataKey="paid" stackId="a" fill="#04BC6C" background={{ fill: '#DBE3EB' }} radius={3} />
                      <Bar dataKey="late" stackId="a" fill="#D82027" radius={3} />
                    </BarChart>
                  </ResponsiveContainer>
                  <small className="float-left"><strong>{totalPayments - periodRemaining} Payments Made</strong></small>
                  <small className="float-right">Out of {totalPayments} Payments</small>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="text-md-left">
                  Recent Payments
                  <a href="/consumer/loans" className="d-block d-md-inline float-md-right">View All Transaction History</a>
                </CardHeader>
                <Table className="mb-0" size="sm" responsive striped borderless>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      payments.map((item, index) => (
                        index < 5 &&
                        <tr key={index}>
                          <th scope="row">{moment(new Date(item.date)).format('MM/DD/YYYY').toString()}</th>
                          <td>{item.info}</td>
                          <td>{item.status.split('.')[2]}</td>
                          <td>${formatCurrency(item.amount, 2)}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </Card>

            </Col>
          </Row>

        </Container>
                  
        <PaymentModal
          isOpen={modal}
          toggle={this.handleModal}
          message={this.state.message}
          nextPaymentAmount={nextPaymentAmount}
          nextPaymentDate={nextPaymentDate}
          pastDueAmount={pastDueAmount}
          paymentMethods={allpaymentmethods}
          putMakePayment={this.putMakePayment}
        />
      </div>
    );
  }
}

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  fetchPaymentsList : PropTypes.func.isRequired,
  selectLoanId: PropTypes.func.isRequired,
  loansList: PropTypes.object.isRequired,
  loanDetail: PropTypes.object.isRequired,
  loanTerm: PropTypes.object.isRequired,
  paymentsList: PropTypes.object.isRequired,
  fetchDocuments: PropTypes.func.isRequired,
  paymentMethods: PropTypes.object.isRequired,
  makePaymentMessage : PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
  loansList: state.dashboard.loansList,
  loanDetail: state.dashboard.loanDetail,
  loanTerm: state.dashboard.loanTerm,
  transactionsList: state.dashboard.transactionsList,
  paymentsList :  state.dashboard.paymentsList,
  paymentMethods : state.dashboard.paymentMethods,
  makePaymentMessage: state.dashboard.makePaymentMessage,
});

const mapDispatchToProps = {
  selectLoanId,
  fetchLoanDetail,
  fetchPaymentsList,
  fetchTransactionsList,
  fetchDocuments,
  fetchLoanTerm,
  makePayment,
  fetchPaymentMethods
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
