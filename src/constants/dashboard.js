// @flow

/**
 * @module Constants/Dashboard
 * @desc Dashboard Constants
 */

import keyMirror from 'fbjs/lib/keyMirror';

/**
 * @constant {Object} DashboardConstants
 * @memberof Dashboard
 */
export const DashboardConstants = keyMirror({
  FETCH_LOANS_LIST: undefined,
  FETCH_LOAN_DETAIL: undefined,
  FETCH_LOAN_TERM: undefined,
  FETCH_TRANSACTIONS_LIST: undefined,
  FETCH_PAYMENTS_LIST: undefined,
  SELECT_LOAN_ID: undefined,
  FETCH_PAYMENT_METHODS : undefined,
  FETCH_DOCUMENTS : undefined,
  DOWNLOAD_DOCUMENT : undefined,
  REMOVE_PAYMENTACCOUNT : undefined,
  FETCH_PCI_WALLET : undefined,
  PUT_PAYMENT_ACCOUNT : undefined,
  MAKE_PAYMENT : undefined,
});
