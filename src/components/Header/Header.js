import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { NavLink, withRouter } from 'react-router-dom';
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Nav,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import { connect } from 'react-redux';
import { signOut } from 'actions/auth';
import { IconSupport } from 'components/Icons';
import { appConfig } from 'config/appConfig';

export class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      modal: false
    };
  }

  toggle = () => {
    this.setState({
      dropdown: !this.state.dropdown
    });
  }

  handlePageNavigation = (route, e) => {
    e.preventDefault();
    const { history } = this.props;
    history.push(route);
  }

  handleSignOut = () => {
    // window.intercomReset(appConfig.intercomId);
    this.props.signOut();
  }

  handleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    return (
      <div>
        <Navbar light expand="lg" className="consumer-header">
          <NavbarBrand className="text-hide" onClick={this.handlePageNavigation.bind(null, '/consumer/dashboard')}>LendingUSA Portal</NavbarBrand>
          {
            localStorage.idToken ?
              <Fragment>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.dropdown} navbar>
                  <Nav navbar className="w-100">
                    <div className="lu-main-nav d-lg-flex ml-lg-auto">
                      <NavItem>
                        <NavLink to="/consumer/dashboard" className="nav-link">Dashboard</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="/consumer/loans" className="nav-link">My Loans</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="/consumer/documents" className="nav-link">Documents</NavLink>
                      </NavItem>
                    </div>
                    <div className="lu-second-nav d-lg-flex ml-lg-auto">
                      <NavItem className="mr-3">
                        <Button color="link" className="p-0" title="Contact Us" onClick={this.handleModal}>
                          <IconSupport />
                        </Button>
                      </NavItem>
                      <NavItem className="align-items-center d-none d-xl-flex">
                        <NavLink to="tel:8009946177" className="flex-column p-0 text-right nav-link nav-tel">
                          <h6 className="text-muted text-right w-100 mb-0">Questions?</h6>
                          <strong>800-994-6177</strong>
                        </NavLink>
                      </NavItem>
                      <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                          Account
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem tag='span' onClick={this.handlePageNavigation.bind(null, '/consumer/settings')}>Account Settings</DropdownItem>
                          <DropdownItem tag='span' to="/" onClick={this.handleSignOut}>Sign Out</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </Nav>
                </Collapse>
              </Fragment>
            :
              <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                }}
              >
                <a href="tel:+18009946177" className="phoneNumber"><span>Questions?&nbsp;</span><strong>(800) 994-6177</strong></a>
              </div>
          }
        </Navbar>
      </div>
      // <!-- End Portal Header -->
      // End Global Header
    );
  }
}

HeaderComponent.propTypes = {
  signOut: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isApplicationReviewDataLoaded: PropTypes.bool,
  location: PropTypes.object.isRequired,
};

HeaderComponent.defaultProps = {
  isApplicationReviewDataLoaded: true,
};

export default compose(
  withRouter,
  connect(
    null,
    {
      signOut,
    }
  )
)(HeaderComponent);
