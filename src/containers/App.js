import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import {
  Route,
  Redirect,
  Switch,
  withRouter,
} from 'react-router-dom';
import IdleTimer from 'react-idle-timer';

import { Header } from 'components/Header';
import Footer from 'components/Footer';
import { signOut } from 'actions/auth';
import Login from './pages/Auth/Login';
import SetNewPassword from './pages/Auth/SetNewPassword';
import Forgot from './pages/Auth/Forgot';
import ChangePassword from './pages/Auth/ChangePassword';
import Registration from "./pages/Registration/Registration";
import RegistrationConfirm from "./pages/Registration/RegistrationConfirm";
import Dashboard from './pages/Dashboard'
import MyLoans from './pages/MyLoans'
import Documents from './pages/Documents'
import Settings from './pages/Settings'

import { appConfig } from 'config/appConfig';
import styles from './App.scss'; // eslint-disable-line

const PrivateRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        const token = localStorage.getItem('idToken');

        return token ?
          <InternalComponent {...props} />
        :
          <Redirect
            to={{
              pathname: '/',
              // eslint-disable-next-line
              state: { from: props.location },
            }}
          />;
      }
    }
  />
);

const PublicRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        const token = localStorage.getItem('idToken');

        return !token ?
          <InternalComponent {...props} />
        :
          <Redirect
            to={{
              pathname: '/consumer/dashboard',
              // eslint-disable-next-line
              state: { from: props.location },
            }}
          />;
      }
    }
  />
);

const MultiRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={(props) => <InternalComponent {...props} />}
  />
);

const routes = [
  {
    name: 'Login',
    pathname: '/',
    component: Login,
    exact: true,
    wrapper: PublicRoute,
  },
  {
    name: 'Forgot',
    pathname: '/forgot',
    component: Forgot,
    exact: true,
    wrapper: PublicRoute,
  },
  {
    name: 'New Password',
    pathname: '/set-new-password',
    component: SetNewPassword,
    exact: true,
    wrapper: PublicRoute,
  },

  {
    name: "Registration",
    pathname: "/registration",
    component: Registration,
    exact: true,
    wrapper: PublicRoute
  },
  {
    name: "RegistrationConfirm",
    pathname: "/registration-confirm",
    component: RegistrationConfirm,
    exact: true,
    wrapper: PublicRoute
  },
  // end Internal pages
  {
    name: 'Dashboard',
    pathname: '/consumer/dashboard',
    component: Dashboard,
    wrapper: PrivateRoute,
  },
  {
    name: 'My Loans',
    pathname: '/consumer/loans',
    component: MyLoans,
    wrapper: PrivateRoute,
  },
  {
    name: 'Documents',
    pathname: '/consumer/documents',
    component: Documents,
    wrapper: PrivateRoute,
  },
  {
    name: 'Settings',
    pathname: '/consumer/settings',
    component: Settings,
    wrapper: PrivateRoute,
  },
  {
    name: 'Reset Password',
    pathname: '/dashboard/reset-password',
    component: ChangePassword,
    exact: true,
    wrapper: PrivateRoute,
  },
];

const extendedFooters = [
  '/dashboard/text-apply',
  '/applications/dtm/application',
];

export class ParentRoute extends Component {
  constructor(props) {
    super(props);
    this.idleTimer = null;
  }

  // eslint-disable-next-line
  onIdle = (e) => {
    localStorage.getItem('idToken') && this.props.signOut();
  }

  componentDidMount() {
    if (appConfig.enableIntercom) {
      window.intercomInit && window.intercomInit(appConfig.intercomId);
      window.intercomInit && window.upscope(appConfig.upscopeId);
    }
  }

  loadIntercom = () => {
    if (appConfig.enableIntercom) {
      window.intercomInit && window.intercomInit(appConfig.intercomId);
    }
  }

  stopIntercom = () => {
    if (appConfig.enableIntercom) {
      window.intercomReset(appConfig.intercomId);
    }
  }

  renderFooter = () => {
    const { location: { pathname } } = this.props;
    
    return <Footer isContentVisible={extendedFooters.indexOf(pathname) !== -1} />;
  }

  render() {
    if (window.Intercom) {
      this.stopIntercom();
    } else {
      this.loadIntercom();
    }

    return (
      <IdleTimer
        ref={(ref) => { this.idleTimer = ref; }}
        element={document}
        onActive={this.onActive}
        onIdle={this.onIdle}
        timeout={1000 * 60 * 60}
      >
        <div className="App bg-light">
          <Header />
          <div className={cn('container-body corporate')}>
            <Switch>
              {routes.map((route, index) => (
                <route.wrapper
                  component={route.component}
                  key={index}
                  path={route.pathname}
                  exact={route.exact || false}
                />))
              }
              <Redirect to="/" />
            </Switch>
          </div>
          {this.renderFooter()}
        </div>
      </IdleTimer>
    );
  }
}

PublicRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

MultiRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

ParentRoute.propTypes = {
  signOut: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      signOut,
    }
  )
)(ParentRoute);
