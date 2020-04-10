import axios from "axios";

import {
  PROFILE_ERROR,
  GET_PROFILE,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
} from "./types";

// Get Curent Profile
export const getCurrentUserProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/v1/auth/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response, status: err.response },
    });
  }
};

// Create Profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    const res = await axios.post("/api/v1/auth/profile", formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response, status: err.response },
    });
  }
};

// Update Profile
export const updateProfile = (formData, history, id) => async (dispatch) => {
  try {
    let res = await axios.get("/api/v1/auth/me");

    const config = {
      headers: {
        "Conetent-Type": "application/json",
      },
      credentials: "include",
    };

    res = await axios.put("/api/v1/auth/profile/:id", formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    history.push("/dashboard");
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response, status: err.response },
    });
  }
};

// Delete Account
export const deleteAccount = (id) => async (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      await axios.delete("/api/v1/auth/profile/:id");

      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({
        type: ACCOUNT_DELETED,
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response, status: err.response },
      });
    }
  }
};
