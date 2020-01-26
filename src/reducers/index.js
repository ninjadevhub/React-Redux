import { combineReducers } from 'redux';
import { AuthConstants } from 'constants/auth';
import { DashboardConstants } from 'constants/dashboard';
import fetch from './fetch';
import dashboard from './dashboard';

const appReducer = combineReducers({
  dashboard,
  fetch,
});

export default (state, action) => {
  const myState = action.type === AuthConstants.AUTH_SIGN_OUT ? undefined : state;
  if(action.type === DashboardConstants.SELECT_LOAN_ID) {
    myState.dashboard.loansList.activeLoanId = action.payload
  }
  return appReducer(myState, action);
};
