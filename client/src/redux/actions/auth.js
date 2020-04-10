import axios from "axios";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";

// Get Logged in User
export const getLoggedInUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/auth/me");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    if (error) {
      dispatch({ type: AUTH_ERROR });
    }
  }
};

// Register User
export const registerUser = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const user = await axios.post("/api/v1/auth/register", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: user.data,
    });
  } catch (error) {
    if (error) {
      dispatch({ type: REGISTER_FAIL });
    }
  }
};

// Login User
export const loginUser = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/v1/auth/login", body, config);
    console.log(res);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
      token: res.headers.credentials.token,
    });
    dispatch(getLoggedInUser());
  } catch (error) {
    if (error) {
      dispatch({ type: LOGIN_FAIL });
    }
  }
};

//Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
  dispatch({
    type: LOGOUT,
  });
};
