import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Components
import Register from "./components/Register/Register.component";
import Login from "./components/Login/Login.component";

import "./App.css";

const App = () => {
  return (
    <div className='App'>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
};

export default App;
