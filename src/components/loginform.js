import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import Notification from "./notification";
import { LogUserIn } from "../auth/authService";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://nalosolutions.com/">
        Nalo Solutions
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#1a237e",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginForm = (props) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  const [loginValues, setLoginValues] = useState({
    login: false,
    showPassword: false,
  });

  const [notificationValues, setNotificationValues] = React.useState({
    success: "info",
    message: "",
    finish: false,
  });

  const handleNotificationClose = () => {
    setNotificationValues({
      ...notificationValues,
      finish: false,
    });
  };

  const onSubmit = async (data, e) => {
    if (e.target.id === "login-form") {
      setLoginValues({
        ...loginValues,
        login: true,
      });
      const resp = await LogUserIn(data);

      if (resp !== undefined) {
        if (resp.status === 200 || resp.status === 201) {
          // log user in
          setLoginValues({
            ...loginValues,
            login: false,
          });
          props.history.push({
            pathname: "/dashboard",
            state: { ...resp.data },
          });
          // props.history.push("/dashboard", { id: 7, color: "green" });
        } else {
          setNotificationValues({
            success: "error",
            message: "Login attempt failed. Username and password mismatch",
            finish: true,
          });
          setLoginValues({
            ...loginValues,
            login: false,
          });
        }
      } else {
        setNotificationValues({
          success: "error",
          message: "Error connecting to system. Contact Administrator",
          finish: true,
        });
        setLoginValues({
          ...loginValues,
          login: false,
        });
      }
    }
  };

  const handleClickShowPassword = () => {
    setLoginValues({ ...loginValues, showPassword: !loginValues.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          id="login-form"
        >
          <TextField
            inputRef={register({
              required: true,
              minLength: 3,
              pattern: {
                value: /^[a-zA-Z0-9@_-\s]*$/,
                message: "Name contains unacceptable characters",
              },
            })}
            error={errors.username && true}
            name="username"
            label="Username"
            margin="normal"
            autoFocus
            variant="outlined"
            placeholder="Enter your username"
            fullWidth
          />
          <div style={{ color: "red", width: "100vw" }}>
            <Typography variant="caption" gutterBottom align="center">
              {errors.username && errors.username.message}
            </Typography>
            <Typography variant="caption" gutterBottom align="center">
              {errors.username &&
                errors.username.type === "minLength" &&
                "Username very short"}
            </Typography>
          </div>
          <TextField
            inputRef={register({
              required: true,
              minLength: 3,
              pattern: {
                value: /^[a-zA-Z0-9@_-\s]*$/,
                message: "Password contains unacceptable characters",
              },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {loginValues.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={errors.password && true}
            type={loginValues.showPassword ? "text" : "password"}
            name="password"
            label="Password"
            variant="outlined"
            margin="normal"
            placeholder="Enter your password"
            fullWidth
          />
          <div style={{ color: "red", width: "100vw" }}>
            <Typography variant="caption" gutterBottom align="center">
              {errors.password && errors.password.message}
            </Typography>
            <Typography variant="caption" gutterBottom align="center">
              {errors.password &&
                errors.password.type === "minLength" &&
                "Password very short"}
            </Typography>
          </div>

          <Button
            fullWidth
            color="primary"
            variant="outlined"
            size="large"
            className={classes.submit}
            type="submit"
            disabled={loginValues.login}
          >
            {loginValues.login && <CircularProgress size={20} />}
            Login
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
      <Snackbar
        className="notification"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={notificationValues.finish}
        autoHideDuration={5000}
        onClose={handleNotificationClose}
      >
        <Notification
          onClose={handleNotificationClose}
          variant={notificationValues.success}
          message={notificationValues.message}
        />
      </Snackbar>
    </Container>
  );
};

export default LoginForm;
