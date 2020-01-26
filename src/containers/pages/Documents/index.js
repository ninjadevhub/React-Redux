import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import get from 'lodash/get';
import {
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
import { fetchDocuments, downloadDocument, selectLoanId, fetchLoanDetail, fetchPaymentsList, fetchTransactionsList, fetchLoanTerm} from 'actions/dashboard';

const IconDocument = (props) => (
  <svg width="15px" height="20px" viewBox="0 0 15 20" fill="#B0ACBE" className={props.className}>
    <g stroke="none">
      <g transform="translate(-75.000000, -372.000000)">
        <g transform="translate(50.000000, 186.000000)">
          <g transform="translate(25.000000, 171.000000)">
            <path d="M8.75,20.3125 L8.75,15 L0.9375,15 C0.41796875,15 0,15.4179688 0,15.9375 L0,34.0625 C0,34.5820312 0.41796875,35 0.9375,35 L14.0625,35 C14.5820312,35 15,34.5820312 15,34.0625 L15,21.25 L9.6875,21.25 C9.171875,21.25 8.75,20.828125 8.75,20.3125 Z M15,19.7617188 L15,20 L10,20 L10,15 L10.2382812,15 C10.4882812,15 10.7265625,15.0976562 10.9023438,15.2734375 L14.7265625,19.1015625 C14.9023438,19.2773438 15,19.515625 15,19.7617188 Z" id="Shape"></path>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

class ConsumerDocuments extends Component {
  state = {
    activeLoanId:'',
    activeText:''
  }
  componentDidMount() {
    const { loansList } = this.props;
    this.props.fetchDocuments(loansList.activeLoanId);
    this.setState({ activeLoanId: loansList.activeLoanId });

    loansList.data.forEach((item) => {
      if(item.id === loansList.activeLoanId){
        const activeText = item.displayId;
        this.setState({ activeText });
      }
    });
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if(!this.props.loansList.isLoading && this.props.loansList !== prevProps.loansList) {
      this.setState({ activeLoanId: this.props.loansList.activeLoanId });
      this.props.loansList && this.props.loansList.data.forEach((item) => {
        if(item.id === this.props.loansList.activeLoanId){
          const activeText = item.displayId;
          this.setState({activeText: activeText});
        } 
      });
  }
  }

  handleChange = (e) => {
    var index = e.nativeEvent.target.selectedIndex;
    var text = e.nativeEvent.target[index].text;
    this.setState({activeLoanId : e.target.value});
    this.setState({activeText : text});
    // this.props.fetchLoanDetail(e.target.value);
    // this.props.fetchPaymentsList(e.target.value);
    // this.props.fetchTransactionsList(e.target.value);
    this.props.fetchDocuments(e.target.value);
    // this.props.fetchLoanTerm(e.target.value)
    // this.props.selectLoanId(e.target.value);

  }

  download = (e) => {
    const fileId = e.nativeEvent.target.getAttribute('fileId')
    const fileName = e.nativeEvent.target.getAttribute('fileName')
    this.props.downloadDocument(this.state.activeLoanId + '&' + fileId + '&' + fileName);
  }

  render() {
    const { loansList, documents } = this.props;
    const activeloanId = this.state.activeLoanId;
    const documentslist = get(documents, 'data', []);
    return (
      <div className="page-documents pb-3">
        <Container fluid>
          <Row className="mb-3 align-items-center">
            <Col className="text-center text-md-left">
              <h3 className="mb-0">Documents</h3>
              {/* <strong>{this.state.activeText}</strong> */}
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
            <Col md={0} lg={12}>
              <Card>
                <CardHeader className="text-md-left">
                  Statements and Contracts
                </CardHeader>
                <CardBody style={{height: 595 }}>
                  <Table className="mb-0" size="sm"  responsive striped borderless>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        documentslist.map((item, index) => {
                          return(<tr key={index}>
                            <td><IconDocument className="mr-1" /> {item.fileAttachment.fileOriginalName}</td>
                            <td>{moment(new Date(item.created)).format('MM/DD/YYYY').toString()}</td>
                            <td><a onClick={this.download} className="btn-icon"><img src="/icons/download.svg" alt="download" fileId={item.id} fileName={item.fileAttachment.fileName} /></a></td>
                          </tr>)
                        })
                      }
                    </tbody>
                  </Table>  
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>

      </div>
    );
  }
}


ConsumerDocuments.propTypes = {
  history: PropTypes.object.isRequired,
  loansList: PropTypes.object.isRequired,
  documents: PropTypes.object.isRequired,
  fetchDocuments: PropTypes.func.isRequired,
  downloadDocument : PropTypes.func.isRequired,
  selectLoanId: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  loansList: state.dashboard.loansList,
  documents: state.dashboard.documents,
});

const mapDispatchToProps = {
  fetchDocuments,
  downloadDocument,
  selectLoanId,
  fetchLoanDetail,
  fetchPaymentsList,
  fetchTransactionsList,
  fetchLoanTerm,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ConsumerDocuments);

