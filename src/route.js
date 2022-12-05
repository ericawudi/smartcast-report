import React from "react";
import { Redirect, Route, BrowserRouter, Switch } from "react-router-dom";
import App from "./pages/App";
import Login from "./pages/login";
import { isAuthenticated } from "./auth/authService";
import ErrorPage from "./pages/errorPage";
import Signup from "./pages/signup";

const AppRouter = () => {
  return (
    <BrowserRouter basename="/">
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/dashboard" component={App} />
        <PrivateRoute component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default AppRouter;
