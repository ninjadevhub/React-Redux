// @flow
/**
 * @module Reducers/Dashboard
 * @desc Dashboard Reducer
 */

import { handleActions } from 'redux-actions';
import get from 'lodash/get';
import { DashboardConstants } from 'constants/dashboard';
import { requestPending, requestSuccess, requestFail } from 'components/Fetch';

const loansList = localStorage.getItem('loansList');
const initialState = {
  loansList: {
    isLoading: false,
    activeLoanId: loansList !== null ? JSON.parse(loansList)[0].id : null,
    data: loansList !== null ? JSON.parse(loansList) : null
  },
  customerDetail: { isLoading: false },
  loanDetail: { isLoading: false },
  loanTerm: { isLoading: false },
  transactionsList: { isLoading: false },
  paymentsList: { isLoading: false },
  paymentMethods : {isLoading:false},
  documents : {isLoading:false},
  donwload : {isLoading:false},
  remove : {isLoading:false},
  urlPCIWallet : {isLoading:false},
  putPaymentMethod : {isLoading:false},
  makePaymentMessage : {isLoading:false},
};

export default handleActions({
  [requestPending(DashboardConstants.FETCH_LOANS_LIST)]: state => ({
    ...state,
    loansList: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_LOANS_LIST)]: (state, action) => ({
    ...state,
    loansList: {
      data: action.payload,
      activeLoanId: get(action, 'payload.0.id', null),
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.FETCH_LOANS_LIST)]: (state, action) => ({
    ...state,
    loansList: {
      error: action.payload,
      isLoading: false
    }
  }),

  [requestPending(DashboardConstants.FETCH_CUSTOMER_DETAIL)]: state => ({
    ...state,
    customerDetail: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_CUSTOMER_DETAIL)]: (state, action) => ({
    ...state,
    customerDetail: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.FETCH_CUSTOMER_DETAIL)]: (state, action) => ({
    ...state,
    customerDetail: {
      error: action.payload,
      isLoading: false
    }
  }),

  [requestPending(DashboardConstants.FETCH_LOAN_DETAIL)]: state => ({
    ...state,
    loanDetail: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_LOAN_DETAIL)]: (state, action) => ({
    ...state,
    loanDetail: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.FETCH_LOAN_DETAIL)]: (state, action) => ({
    ...state,
    loanDetail: {
      error: action.payload,
      isLoading: false
    }
  }),

  [requestPending(DashboardConstants.FETCH_LOAN_TERM)]: state => ({
    ...state,
    loanTerm: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_LOAN_TERM)]: (state, action) => ({
    ...state,
    loanTerm: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.FETCH_LOAN_TERM)]: (state, action) => ({
    ...state,
    loanTerm: {
      error: action.payload,
      isLoading: false
    }
  }),

  [requestPending(DashboardConstants.FETCH_TRANSACTIONS_LIST)]: state => ({
    ...state,
    transactionsList: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_TRANSACTIONS_LIST)]: (state, action) => {
    return {
    ...state,
    transactionsList: {
      data: action.payload,
      isLoading: false
    },
  }},
  [requestFail(DashboardConstants.FETCH_TRANSACTIONS_LIST)]: (state, action) => ({
    ...state,
    transactionsList: {
      error: action.payload,
      isLoading: false
    }
  }),

  [requestPending(DashboardConstants.FETCH_DOCUMENTS)]: state => ({
    ...state,
    documents: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_DOCUMENTS)]: (state, action) => ({
    ...state,
    documents: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.FETCH_DOCUMENTS)]: (state, action) => ({
    ...state,
    documents: {
      error: action.payload,
      isLoading: false
    }
  }),

  [requestPending(DashboardConstants.FETCH_PAYMENTS_LIST)]: state => ({
    ...state,
    paymentsList: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_PAYMENTS_LIST)]: (state, action) => ({
    ...state,
    paymentsList: {
      data:action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.FETCH_PAYMENTS_LIST)]: (state, action) => ({
    ...state,
    paymentsList: {
      error: action.payload,
      isLoading: false
    }
  }),
  [requestPending(DashboardConstants.FETCH_PAYMENT_METHODS)]: state => ({
    ...state,
    paymentMethods: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_PAYMENT_METHODS)]: (state, action) => ({
    ...state,
    paymentMethods: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.FETCH_PAYMENT_METHODS)]: (state, action) => ({
    ...state,
    paymentMethods: {
      error: action.payload,
      isLoading: false
    }
  }),
  [requestPending(DashboardConstants.DOWNLOAD_DOCUMENT)]: state => ({
    ...state,
    donwload: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.DOWNLOAD_DOCUMENT)]: (state, action) => ({
    ...state,
    donwload: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.DOWNLOAD_DOCUMENT)]: (state, action) => ({
    ...state,
    donwload: {
      error: action.payload,
      isLoading: false
    }
  }),
  [requestPending(DashboardConstants.REMOVE_PAYMENTACCOUNT)]: state => ({
    ...state,
    remove: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.REMOVE_PAYMENTACCOUNT)]: (state, action) => ({
    ...state,
    remove: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.REMOVE_PAYMENTACCOUNT)]: (state, action) => ({
    ...state,
    remove: {
      error: action.payload,
      isLoading: false
    }
  }),
  [requestPending(DashboardConstants.FETCH_PCI_WALLET)]: state => ({
    ...state,
    urlPCIWallet: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.FETCH_PCI_WALLET)]: (state, action) => ({
    ...state,
    urlPCIWallet: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.FETCH_PCI_WALLET)]: (state, action) => ({
    ...state,
    urlPCIWallet: {
      error: action.payload,
      isLoading: false
    }
  }),
  [requestPending(DashboardConstants.PUT_PAYMENT_ACCOUNT)]: state => ({
    ...state,
    putPaymentMethod: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.PUT_PAYMENT_ACCOUNT)]: (state, action) => ({
    ...state,
    putPaymentMethod: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.PUT_PAYMENT_ACCOUNT)]: (state, action) => ({
    ...state,
    putPaymentMethod: {
      error: action.payload,
      isLoading: false
    }
  }),
  [requestPending(DashboardConstants.MAKE_PAYMENT)]: state => ({
    ...state,
    makePaymentMessage: {
      isLoading: true
    },
  }),
  [requestSuccess(DashboardConstants.MAKE_PAYMENT)]: (state, action) => ({
    ...state,
    makePaymentMessage: {
      data: action.payload,
      isLoading: false
    },
  }),
  [requestFail(DashboardConstants.MAKE_PAYMENT)]: (state, action) => ({
    ...state,
    makePaymentMessage: {
      error: action.payload,
      isLoading: false
    }
  }),
}, initialState);
