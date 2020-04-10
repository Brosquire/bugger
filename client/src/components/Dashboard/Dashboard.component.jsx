import React, { useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  deleteAccount,
  updateProfile,
  createProfile,
} from "../../redux/actions/profiles";

import { getLoggedInUser } from "../../redux/actions/auth";

const Dashboard = ({
  getLoggedInUser,
  deleteAccount,
  auth: { user },
  profile,
}) => {
  useEffect(() => {
    getLoggedInUser();
  }, [getLoggedInUser]);
  return profile === null ? (
    <Fragment>Loading...</Fragment>
  ) : (
    <Fragment>
      <h1 className='large-text'>Dashboard</h1>
      <p className='main-text'>Welcome {user && profile}</p>
      {profile !== null ? (
        <Fragment>
          <div className='medium-text'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              Delete My Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          Youy have not yet setup a profile. Please add some info to your
          profile. <br />
          <Link to='/create-profile' className='btn btn-primary tiny-text'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getLoggedInUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getLoggedInUser,
  deleteAccount,
})(Dashboard);
