import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Components
import Register from "./components/Register/Register.component";
import Login from "./components/Login/Login.component";
import Dashboard from "./components/Dashboard/Dashboard.component";
import PrivateRoute from "./components/routing/PrivateRoute.component";

import "./App.css";

const App = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }
  return (
    <div className='App'>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            {/* <PrivateRoute
              exact
              path='/create-profile'
              component={CreateProfile}
            />
            <PrivateRoute exact path='/edit-profile' component={EditProfile} /> */}
          </Switch>
        </Router>
      </Provider>
    </div>
  );
};

export default App;
