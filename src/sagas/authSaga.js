import { call, put, takeEvery, all } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import urls from 'config/urls';
import { awsLoginRequest, signOut as signOutRequest } from 'utils/aws';
import { DashboardConstants } from 'constants/dashboard';
import { AuthConstants } from 'constants/auth';
import { request, requestPending, requestSuccess, requestFail } from 'components/Fetch';;


function* signIn({ payload }) {
  try {
    yield put({
      type: requestPending(AuthConstants.AUTH_SIGN_IN),
    });
    const response = yield call(awsLoginRequest, { payload: payload.data });
    if (response.error === 'New password required') {
      yield put(push('/set-new-password'));
      yield put({
        type: requestFail(AuthConstants.AUTH_SIGN_IN),
        payload: new Error('New password required'),
      });
      localStorage.setItem('user.username', payload.data.username);
    } else {
      yield put({
        type: requestSuccess(AuthConstants.AUTH_SIGN_IN),
        payload: response,
      });
      localStorage.setItem('token', response.accessToken.jwtToken);
      localStorage.setItem('user.username', response.idToken.payload.preferred_username);
      localStorage.setItem('user.firstName', response.idToken.payload['custom:first_name'] || '');
      localStorage.setItem('user.lastName', response.idToken.payload['custom:last_name'] || '');
      localStorage.setItem('idToken', response.idToken.jwtToken);
      localStorage.setItem('refreshToken', response.refreshToken.token);
      localStorage.setItem('expiryTime', Date.now() + (3600 * 1000));
      localStorage.setItem('isTokenRefreshing', false);

      // payload.success('success');

      const [customerDetail, loansList] = yield all([
        call(request({
          type: DashboardConstants.FETCH_CUSTOMER_DETAIL,
          method: 'GET',
          url: urls.fetchCustomerDetail(),
        })),
        call(request({
          type: DashboardConstants.FETCH_LOANS_LIST,
          method: 'GET',
          url: urls.fetchLoansListUrl()
        }))
      ]);

      if (customerDetail && loansList) {
        console.log('customerDetail --- ', customerDetail, 'loansList --- ', loansList);

        localStorage.setItem('customerDetail', JSON.stringify(customerDetail));
        localStorage.setItem('loansList', JSON.stringify(loansList));

        payload.success('success')
      } else {
        localStorage.clear();
        payload.fail({ message: 'Error occured, Try again!'})
      }
    }
  } catch (err) {
    yield put({
      type: requestFail(AuthConstants.AUTH_SIGN_IN),
      payload: err,
    });
    payload.fail(err);
  }
}

function* signOut() {
  signOutRequest();
  localStorage.clear();
  yield put({ type: requestSuccess(AuthConstants.AUTH_SIGN_OUT) });
  yield put(push('/'));
}

export default function* () {
  yield takeEvery(AuthConstants.AUTH_SIGN_IN, signIn);
  yield takeEvery(AuthConstants.AUTH_SIGN_OUT, signOut);
}
