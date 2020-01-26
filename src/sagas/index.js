import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import dashboardSaga from './dashboardSaga';

export default function* () {
  yield all([
    authSaga(),
    dashboardSaga(),
  ]);
}
