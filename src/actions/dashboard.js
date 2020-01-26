import { DashboardConstants } from 'constants/dashboard';
import { createAction } from 'redux-actions';

export const fetchLoansList = createAction(DashboardConstants.FETCH_LOANS_LIST);
export const fetchLoanDetail = createAction(DashboardConstants.FETCH_LOAN_DETAIL);
export const fetchLoanTerm = createAction(DashboardConstants.FETCH_LOAN_TERM);
export const fetchTransactionsList = createAction(DashboardConstants.FETCH_TRANSACTIONS_LIST);
export const fetchPaymentsList = createAction(DashboardConstants.FETCH_PAYMENTS_LIST);
export const selectLoanId = createAction(DashboardConstants.SELECT_LOAN_ID);
export const fetchPaymentMethods = createAction(DashboardConstants.FETCH_PAYMENT_METHODS);
export const fetchDocuments = createAction(DashboardConstants.FETCH_DOCUMENTS);
export const downloadDocument = createAction(DashboardConstants.DOWNLOAD_DOCUMENT);
export const removePaymentMethod = createAction(DashboardConstants.REMOVE_PAYMENTACCOUNT)
export const fetchUrlPCIWallet = createAction(DashboardConstants.FETCH_PCI_WALLET)
export const putPaymentAccount = createAction(DashboardConstants.PUT_PAYMENT_ACCOUNT)
export const makePayment = createAction(DashboardConstants.MAKE_PAYMENT);

