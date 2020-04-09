import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
} from "../actions/types";

const intitialState = {
  token: null,
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = intitialState, action) {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        laoding: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        token: action.token,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
}
