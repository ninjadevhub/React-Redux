// @flow
/**
 * @module AWSCognito
 * @desc AWSCognito Login function
 */

import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';

import { appConfig } from '../config/appConfig';
import Amplify, {Auth} from 'aws-amplify'

Amplify.configure({
  Auth: {

      // REQUIRED - Amazon Cognito Region
      region: 'us-west-2',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'us-west-2_edKvwXCcd',

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '1n7goesqckefu2nkdeq4cuujd0',

      // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'ALLOW_USER_SRP_AUTH',

      // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
      clientMetadata: { 'ssn': '666-45-7789' }

  }
});

const poolData = {
  UserPoolId: appConfig.userPoolId,
  ClientId: appConfig.clientId,
};

const getTokens = session => ({
  accessToken: session.getAccessToken().getJwtToken(),
  idToken: session.getIdToken().getJwtToken(),
  refreshToken: session.getRefreshToken().getToken(),
});

let cognitoUser = null;

// ----- use gloabl cognitoUser to successfully get session info -----
export const getCognitoUser = () => {
  if (!cognitoUser) {
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: localStorage.getItem('user.username'),
      Pool: userPool,
    };
    cognitoUser = new CognitoUser(userData);
  }

  return cognitoUser;
};

export const awsLoginRequest = action => new Promise((resolve, reject) => {
  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: action.payload.username,
    Pool: userPool,
  };
  cognitoUser = new CognitoUser(userData);

  const authenticationData = {
    Username: action.payload.username,
    Password: action.payload.password,
  };


  const authenticationDetails = new AuthenticationDetails(authenticationData);

  cognitoUser.authenticateUser(authenticationDetails, {
    // eslint-disable-next-line
    onSuccess: (authenticateResult) => {
      resolve(authenticateResult);
    },

    onFailure: (err) => {
      reject(err);
    },

    // eslint-disable-next-line
    newPasswordRequired: (userAttributes, requiredAttributes) => {
      // User was signed up by an admin and must provide new
      // password and required attributes, if any, to complete
      // authentication.

      // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user.
      // Required attributes according to schema, which don’t have any values yet, will have blank values.
      // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.


      // Get these details and call
      // newPassword: password that user has given
      // attributesData: object with key as attribute name and value that the user has given.
      resolve({
        error: 'New password required',
        cognitoUser,
      });
    },

  });
});

export const refreshToken = () => {
  if (localStorage.token) {
    const RefreshToken = new CognitoRefreshToken({ RefreshToken: localStorage.refreshToken });

    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
          reject(err);
        } else {
          const tokens = getTokens(session);
          localStorage.setItem('token', tokens.accessToken);
          localStorage.setItem('idToken', tokens.idToken);
          localStorage.setItem('refreshToken', tokens.refreshToken);
          localStorage.setItem('expiryTime', Date.now() + (3600 * 1000));
          localStorage.setItem('isTokenRefreshing', 'false');
          resolve(tokens);
        }
      });
    });
  }
};

export const signOut = () => {
  // ----- use gloabl cognitoUser to successfully get session info -----
  // const userPool = new CognitoUserPool(poolData);
  // const userData = {
  //   Username: localStorage.getItem('user.username'),
  //   Pool: userPool,
  // };

  // const cognitoUserSignOut = new CognitoUser(userData);

  if (cognitoUser !== null) {
    cognitoUser.getSession((err, session) => {
      if (err) {
        console.log(err);
        return;
      }
      if (session.isValid()) {
        cognitoUser.signOut();
      }
    });
  }
};
export const signUp = action => {
  
  return new Promise((resolve, reject) => {
    Auth.signUp(action.payload)
      .then(data => {
        console.log("DATA:", data);
        resolve(data);
      })
      .catch(err => {
        console.log("ERR", err);
        reject(err);
      });
    console.log("SIGN UP:", action.payload);
  });
};


export const changePassword = action => {
  return new Promise((resolve, reject) => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, action.currentpassword, action.password);
      })
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err);
      });
  });
};
