import { call, takeEvery, put, all } from 'redux-saga/effects';
import { DashboardConstants } from 'constants/dashboard';
import { request } from 'components/Fetch';
import urls from 'config/urls';

function* fetchLoanDetail(action) {
  yield call(request({
    type: DashboardConstants.FETCH_LOAN_DETAIL,
    method: 'GET',
    url: urls.fetchLoanDetail(action.payload),
  }), action);
}

function* fetchLoanTerm(action) {
  yield call(request({
    type: DashboardConstants.FETCH_LOAN_TERM,
    method: 'GET',
    url: urls.fetchLoanTerm(action.payload),
  }), action);
}


function* fetchTransactionsList(action) {
  yield call(request({
    type: DashboardConstants.FETCH_TRANSACTIONS_LIST,
    method: 'GET',
    url: urls.fetchTransactionsList(action.payload),
  }), action);
}

function* fetchPaymentsList(action) {
  yield call(request({
    type: DashboardConstants.FETCH_PAYMENTS_LIST,
    method: 'GET',
    url: urls.fetchPaymentsList(action.payload),
  }), action);
}

function* fetchDocuments(action) {
  yield call(request({
    type: DashboardConstants.FETCH_DOCUMENTS,
    method: 'GET',
    url: urls.fetchDocuments(action.payload),
  }), action);
}

function* fetchPaymentMethods(action) {
  yield call(request({
    type: DashboardConstants.FETCH_PAYMENT_METHODS,
    method: 'GET',
    url: urls.fetchPaymentMethods(),
  }), action);
}

function* downloadDocument(action) {

  const params = action.payload.split('&');
  const downloadData = yield call(request({
    type: DashboardConstants.DOWNLOAD_DOCUMENT,
    method: 'GET',
    url: urls.downloadDocument(params[0], params[1], params[2]),
    responseType: 'arraybuffer',
  }), action);
  const url = window.URL.createObjectURL(new Blob([downloadData],{type: "application/pdf"}));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', params[2]);
  document.body.appendChild(link);
  link.click();
}
function* removePaymentMethod(action){
  yield call(request({
    type: DashboardConstants.REMOVE_PAYMENTACCOUNT,
    method: 'DELETE',
    url: urls.removePaymentMethod(action.payload)
  }), action)
  
}

function* fetchUrlPCIWallet(action){
  yield call(request({
    type: DashboardConstants.FETCH_PCI_WALLET,
    method: 'GET',
    url:urls.fetchUrlPCIWallet()
  }), action)
}


function* putPaymentAccount(action){
  yield call(request({
    type: DashboardConstants.PUT_PAYMENT_ACCOUNT,
    method: 'PUT',
    url:urls.putPaymentAccount()
  }), action)
}

function* makePayment(action){
  yield call(request({
    type: DashboardConstants.MAKE_PAYMENT,
    method: 'PUT',
    url:urls.fetchPaymentsList(action.payload.loanId)
  }),action)
}

export default function* () {
  yield takeEvery(DashboardConstants.FETCH_LOAN_DETAIL, fetchLoanDetail);
  yield takeEvery(DashboardConstants.FETCH_TRANSACTIONS_LIST, fetchTransactionsList);
  yield takeEvery(DashboardConstants.FETCH_PAYMENTS_LIST, fetchPaymentsList);
  yield takeEvery(DashboardConstants.FETCH_LOAN_TERM, fetchLoanTerm);
  yield takeEvery(DashboardConstants.FETCH_PAYMENT_METHODS, fetchPaymentMethods);
  yield takeEvery(DashboardConstants.FETCH_DOCUMENTS, fetchDocuments);
  yield takeEvery(DashboardConstants.DOWNLOAD_DOCUMENT, downloadDocument);
  yield takeEvery(DashboardConstants.REMOVE_PAYMENTACCOUNT, removePaymentMethod);
  yield takeEvery(DashboardConstants.FETCH_PCI_WALLET, fetchUrlPCIWallet);
  yield takeEvery(DashboardConstants.PUT_PAYMENT_ACCOUNT, putPaymentAccount);
  yield takeEvery(DashboardConstants.MAKE_PAYMENT, makePayment);
}
