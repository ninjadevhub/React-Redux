import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import get from 'lodash/get';
import Switch from 'react-switch';
import NotificationSystem from 'react-notification-system';
import AddPaymentModal from 'components/AddPaymentMethods';
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  FormGroup,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
  Table,
} from 'reactstrap';
import {
  selectLoanId,
  fetchPaymentMethods,
  fetchLoanDetail,
  fetchTransactionsList,
  fetchPaymentsList,
  fetchDocuments,
  fetchLoanTerm,
  removePaymentMethod,
  fetchUrlPCIWallet,
  putPaymentAccount,
  makePayment,
} from 'actions/dashboard';
import PaymentModal from 'components/PaymentModal';
import { formatCurrency } from 'utils/formatCurrency';
import { formatPercentage } from 'utils/formatPercentage';

class ConsumerMyLoans extends Component {
  state = {
    checked: true,
    modal: false,
    addpaymentmodal : false,
    activeLoanId:'',
    activeText:'',
    paymentMethods:[],
    message:[{
      success:'',
      error:''
    }],
    activeLeftTab:'loanterm',
  }
  
  componentDidMount() {
    const { loansList } = this.props;
    this.props.fetchLoanTerm(loansList.activeLoanId);
    this.props.fetchLoanDetail(loansList.activeLoanId);
    this.props.fetchTransactionsList(loansList.activeLoanId);
    this.props.fetchPaymentsList(loansList.activeLoanId);
    this.props.fetchPaymentMethods(loansList.activeLoanId);

    this.setState({ activeLoanId: loansList.activeLoanId });

    loansList.data.forEach((item) => {
      if(item.id === loansList.activeLoanId){
        const activeText = item.displayId;
        this.setState({ activeText: activeText });
      } 
    });
    // this.props.fetchPaymentMethods();
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    const { loansList, makePaymentMessage, paymentMethods, putPaymentMethod, remove } = this.props;

    if(!loansList.isLoading && loansList !== prevProps.loansList) {
      this.setState({ activeLoanId: loansList.activeLoanId });
      loansList.data.forEach((item) => {
        if(item.id === loansList.activeLoanId){
          const activeText = item.displayId;
          this.setState({activeText: activeText});
        } 
      });
    }
    if(!paymentMethods.isLoading && paymentMethods !== prevProps.paymentMethods){
      this.setState({paymentMethods:paymentMethods.data})
    }
    if(!putPaymentMethod.isLoading && putPaymentMethod !== prevProps.putPaymentMethod){
      paymentMethods.data.push(putPaymentMethod.data);
      this.setState({paymentMethods:paymentMethods.data});
    }
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
    if(!remove.isLoading && remove !== prevProps.remove){
      if(remove.error){
        this.notification.addNotification({
          message: remove.error.data.errorMessages,
          level: 'error',
          position: 'tc',
        });
      }
      else{
        this.notification.addNotification({
          message: 'Payment was successfully removed',
          level: 'success',
          position: 'tc',
        });
        this.props.fetchPaymentMethods();
      }
    }
  }

  handleCheck = (checked) => {
    this.setState({ checked });
  }
  
  handleActiveTabLeft = (tab) =>{
    this.setState({activeLeftTab:tab})
  }

  handleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  handleAddPaymentModal = () => {
    this.props.fetchUrlPCIWallet({
      success: (res) => {
        this.setState(prevState => ({
          addpaymentmodal: !prevState.addpaymentmodal,
        }));
      }
    });
  }
  handleChange = (e) => {
    var index = e.nativeEvent.target.selectedIndex;
    var text = e.nativeEvent.target[index].text;
    this.setState({activeLoanId : e.target.value});
    this.setState({activeText : text});
    this.props.fetchLoanDetail(e.target.value);
    this.props.fetchPaymentsList(e.target.value);
    this.props.fetchTransactionsList(e.target.value);
    this.props.fetchDocuments(e.target.value)
    this.props.fetchLoanTerm(e.target.value)
    this.props.selectLoanId(e.target.value);
  }

  removePaymentMethod = (e) => {
    var paymentAccountId = e.nativeEvent.target.getAttribute('paymentAccountId');
    this.props.removePaymentMethod(paymentAccountId);
  }

  savePaymentAccount = (data) => {
    if(data){
      this.props.putPaymentAccount({data: data});
      this.setState({addpaymentmodal : false});
    }
  }
  
  putMakePayment = (data) => {
    this.props.makePayment({data:data, loanId:this.state.activeLoanId});
  }

  loanTermBody = () => {
    const { loanTerm, loanDetail } = this.props;
    return(
      <Table className="mb-0" size="sm" responsive striped borderless>
        <tbody>
          <tr>
            <th scope="row">Principal Amount</th>
            <td className="text-right">${formatCurrency(get(loanTerm, 'data.loanAmount', 0)+get(loanTerm, 'data.underwriting', 0), 2)}</td>
          </tr>
          <tr>
            <th scope="row">Contract Date</th>
            <td className="text-right">{moment(new Date(get(loanTerm, 'data.contractDate', ''))).format('MM/DD/YYYY').toString()}</td>
          </tr>
          <tr>
            <th scope="row">Loan Term</th>
            <td className="text-right">{get(loanTerm, 'data.loanTerm', 0)} Months</td>
          </tr>
          <tr>
            <th scope="row">Interest Rate</th>
            <td className="text-right">{formatPercentage(get(loanTerm, 'data.loanRate', 0))}</td>
          </tr>
          <tr>
            <th scope="row">Final Payment Date</th>
            <td className="text-right">{moment(new Date(get(loanDetail, 'data.0.finalPaymentDate', ''))).format('MM/DD/YYYY').toString()}</td>
          </tr>
        </tbody>
      </Table>
    );
  }

  paymentInfoBody = () => {
    const { loanDetail } = this.props;
    return(
      <Table className="mb-0" size="sm" responsive striped borderless>
        <tbody>
          <tr>
            <th scope="row">Monthly Payment Amount</th>
            <td className="text-right">${formatCurrency(get(loanDetail, 'data.0.nextPaymentAmount', 0), 2)}</td>
          </tr>
          <tr>
            <th scope="row">Payoff Amount</th>
            <td className="text-right">${formatCurrency(get(loanDetail, 'data.0.payoff', 0), 2)}</td>
          </tr>
        </tbody>
      </Table>
    );
  }

  render() {
    const { checked, modal, addpaymentmodal, paymentMethods, activeLeftTab } = this.state
    const { loanDetail, transactionsList, urlPCIWallet} = this.props;
    const loansList = JSON.parse(localStorage.getItem('loansList'));
    const pastDue = Number(get(loanDetail, 'data.0.daysPastDue', 0));
    const nextPaymentAmount = formatCurrency(get(loanDetail, 'data.0.nextPaymentAmount'), 2).split('.');
    const pastDueAmount = formatCurrency(get(loanDetail, 'data.0.amountDue'), 2).split('.');
    const nextPaymentDate = moment(new Date(get(loanDetail, 'data.0.nextPaymentDate', ''))).format('MM/DD/YYYY').toString();
    const activeloanId = this.state.activeLoanId;
    const transactions = get(transactionsList, 'data', []);
    const allpaymentmethods = [];
    paymentMethods.forEach((item) => {
      if(item.checkingAccount.bankName && item.checkingAccount.accountNumber){
        allpaymentmethods.push({accountName: item.checkingAccount.bankName, accountNumber:item.checkingAccount.accountNumber, paymentAccountId: item.id, type:item.checkingAccount.accountType.split('.')})
      }
      if(item.creditCard.cardType && item.creditCard.cardNumber){
        allpaymentmethods.push({accountName: item.creditCard.cardType, accountNumber:item.creditCard.cardNumber, paymentAccountId:item.id, type:item.creditCard.cardType.split('.')})
      }
    })
    
    return (
      <div className="page-myloans pb-3">
        <NotificationSystem ref={(item) => { this.notification = item; }} />
        <Container fluid>
          <Row className="mb-3 align-items-center">
            <Col className="text-center text-md-left">
              <h3 className="mb-0">Loan Details</h3>
              {/* <strong>{this.state.activeText}</strong> */}
            </Col>
            <Col xs={12} md="auto" className="text-right justify-content-end ml-md-3 mt-3 mt-md-0">
              <FormGroup className="dropdown-toggle mb-0 input-inline pb-0">
                <Input type="select" name="select" id="loanSelection" onChange={this.handleChange} value={activeloanId}>
                  <option disabled>Select</option>
                  {
                    loansList && loansList.map((item, index) => (
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
                <CardHeader>
                  Personal Loan
                  <Button color="link" className="btn-icon position-absolute" style={{ top: 6, right: 13 }}>
                    <img src="/icons/edit.svg" alt="Edit" />
                  </Button>
                </CardHeader>
                <CardBody className="text-center no-border pt-0">
                  <Row>
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
                            <h3 className={`mb-0 ${ pastDue > 0 ? 'text-danger' : ''}` } >
                              ${pastDueAmount[0]}.<small className={ `${ pastDue > 0 ? 'text-danger' : '' }` }>{pastDueAmount[1]}</small>
                            </h3>
                          :
                            <h3 className="mb-0" >-</h3>
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
                  <Row className="mt-3">
                    <Col className="text-left">
                      <strong>Paperless Billing</strong>
                    </Col>
                    <Col className="text-right">
                      <small className="mr-1"><strong>{ checked ? 'ON' : 'OFF' }</strong></small>
                      <Switch
                        onChange={this.handleCheck}
                        checked={this.state.checked}
                        className="toggle-switch float-right"
                        onColor="#579BE7"
                        offColor="#3989E3"
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>Payment Methods</CardHeader>
                <ListGroup>
                  <ListGroupItem className="position: relative">
                    {
                      allpaymentmethods.map((item, index) =>
                      <div key={index}>
                        <p className="mb-0"><strong>{item.accountName}</strong> ending {item.accountNumber.slice(-4)}</p>
                        <small>{item.type[2]}</small>
                        <Button color="link" className="btn-icon position-absolute" style={{ top: 23 + index*50, right: 50 }}>
                          <img src="/icons/edit.svg" alt="Edit" />
                        </Button>
                        <Button color="link" className="btn-icon position-absolute" style={{ top: 23 + index*50, right: 13 }} onClick={this.removePaymentMethod}>
                          <img src="/icons/remove2.png" alt="remove" width="25" height="20" index={index} paymentAccountId={item.paymentAccountId}/>
                        </Button>
                      </div>
                    )
                    }
                  </ListGroupItem>
                  <ListGroupItem tag="a" onClick={this.handleAddPaymentModal} className="d-flex">
                    <img src="/icons/add-primary.svg" alt="Add" className="mr-1" />
                    <strong>Add Payment Method</strong>
                  </ListGroupItem>
                </ListGroup>
              </Card>

              <Card>
                <ButtonGroup size="sm" className="d-flex mt-3 mb-3">
                  <Button color="primary" onClick={() => this.handleActiveTabLeft('loanterm')} active={activeLeftTab === 'loanterm' && true}>Loan Terms</Button>
                  <Button color="primary" onClick={() => this.handleActiveTabLeft('paymentinfo')} active={activeLeftTab === 'paymentinfo' && true}>Payment Info</Button>
                </ButtonGroup>
                {activeLeftTab === 'loanterm' && this.loanTermBody()}
                {activeLeftTab === 'paymentinfo' && this.paymentInfoBody()}
              </Card>

            </Col>
            <Col md={6} lg={8}>
              <Card>
                <CardHeader className="text-md-left">
                  Transaction History
                </CardHeader>
                <Table className="mb-0" size="sm" responsive striped borderless>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Fees</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      transactions.map((item, index) => {
                        if(item.type === 'payment'){
                          return(<tr key={index}>
                            <th scope="row">{moment(new Date(item.date)).format('MM/DD/YYYY').toString()}</th>
                            <td>{item.title}</td>
                            <td>${formatCurrency(item.paymentPrincipal, 2)}</td>
                            <td>${formatCurrency(item.paymentInterest, 2)}</td>
                            <td>${formatCurrency(item.paymentFees, 2)}</td>
                            <td><strong>${formatCurrency(item.paymentAmount, 2)}</strong></td>
                          </tr>
                        )}
                        else{
                          return(
                            <tr key={index}>
                              <th scope="row">{moment(new Date(item.date)).format('MM/DD/YYYY').toString()}</th>
                              <td>{item.title}</td>
                              <td>${formatCurrency(item.chargePrincipal, 2)}</td>
                              <td>${formatCurrency(item.chargeInterest, 2)}</td>
                              <td>${formatCurrency(item.chargeFees, 2)}</td>
                              <td><strong>${formatCurrency(item.chargeAmount , 2)}</strong></td>
                            </tr>
                          )
                        }
                      })
                    }
                  </tbody>
                </Table>
              </Card>

            </Col>
          </Row>

        </Container>

        <PaymentModal isOpen={modal} toggle={this.handleModal} nextPaymentAmount={nextPaymentAmount} pastDueAmount={pastDueAmount} paymentMethods={allpaymentmethods} putMakePayment={this.putMakePayment}/>
        <AddPaymentModal isOpen={addpaymentmodal} toggle={this.handleAddPaymentModal} iframeURL={urlPCIWallet} saveToken={this.savePaymentAccount} />

      </div>
    );
  }
}

ConsumerMyLoans.propTypes = {
  history: PropTypes.object.isRequired,
  fetchMyLoansData: PropTypes.func.isRequired,
  selectLoanId: PropTypes.func.isRequired,
  fetchPaymentMethods: PropTypes.func.isRequired,
  loansList: PropTypes.object.isRequired,
  loanDetail: PropTypes.object.isRequired,
  loanTerm: PropTypes.object.isRequired,
  transactionsList: PropTypes.object.isRequired,
  paymentMethods: PropTypes.object.isRequired,
  fetchTransactionsList: PropTypes.func.isRequired,
  urlPCIWallet: PropTypes.object.isRequired,
  fetchUrlPCIWallet : PropTypes.func.isRequired,
  putPaymentMethod : PropTypes.object.isRequired,
  makePaymentMessage : PropTypes.object.isRequired,
  remove: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  loansList: state.dashboard.loansList,
  loanDetail: state.dashboard.loanDetail,
  loanTerm: state.dashboard.loanTerm,
  transactionsList: state.dashboard.transactionsList,
  paymentMethods : state.dashboard.paymentMethods,
  urlPCIWallet : state.dashboard.urlPCIWallet,
  putPaymentMethod : state.dashboard.putPaymentMethod,
  makePaymentMessage : state.dashboard.makePaymentMessage,
  remove: state.dashboard.remove,
});

const mapDispatchToProps = {
  selectLoanId,
  fetchPaymentMethods,
  fetchLoanDetail,
  fetchTransactionsList,
  fetchPaymentsList,
  fetchDocuments,
  fetchLoanTerm,
  removePaymentMethod,
  fetchUrlPCIWallet,
  putPaymentAccount,
  makePayment,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ConsumerMyLoans);
