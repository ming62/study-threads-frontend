import React, { Component, Fragment } from "react";
import Input from "./form-components/input.tsx";
import Alert from "./ui-components/Alert.tsx";
import { withRouter } from "./WithRouter.tsx";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom";

interface LoginState {
  username: string;
  password: string;
  error: string | null;
  errors: ("username" | "password")[];
  alert: {
    type: string;
    message: string;
  };
  handleJWTChange: (jwt: string, username: string, userID: number) => void;
}

interface LoginProps {
  handleJWTChange: (jwt: string, username: string, userID: number) => void;
  router: {
    navigate: (path: string) => void;
  };
}

class Login extends Component<LoginProps, LoginState> {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: null,
      errors: [],
      alert: {
        type: "d-none",
        message: "",
      },
      handleJWTChange: this.props.handleJWTChange,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleJWTChange = this.handleJWTChange.bind(this);
  }

  handleChange = (evt) => {
    let value = evt.target.value;
    let name = evt.target.name;

    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  handleSubmit = (evt) => {
    evt.preventDefault();

    let errors: ("username" | "password")[] = [];
    if (this.state.username === "") {
      errors.push("username");
    }

    if (this.state.password === "") {
      errors.push("password");
    }

    if (errors.length > 0) {
      this.setState({
        errors: errors,
      });
      return false;
    }

    const payload = {
      username: this.state.username,
      password: this.state.password,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    fetch("http://localhost:4000/v1/signin", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          this.setState({
            alert: {
              type: "alert-danger",
              message: data.error.message,
            },
          });
        } else {
          console.log(data);
          const { token, user_id, username } = data.response;
          this.handleJWTChange(token, username, user_id);
          window.localStorage.setItem("jwt", token);
          window.localStorage.setItem("user_id", user_id);
          window.localStorage.setItem("username", username);
          this.props.router.navigate("/home");
        }
      })
      .catch((error) => {
        this.setState({
          alert: {
            type: "alert-danger",
            message: "Username or password is incorrect",
          },
        });
      });
  };

  handleJWTChange(jwt, username, userID) {
    this.props.handleJWTChange(jwt, username, userID);
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1;
  }

  render() {
    let signUpLink = <Link to="/signup">Signup</Link>;

    return (
      <Fragment>
        <h2>Login or {signUpLink}</h2>
        <hr />
        <Alert
          alertType={this.state.alert.type}
          alertMessage={this.state.alert.message}
        />

        <form className="pt-3" onSubmit={this.handleSubmit}>
          <Input
            title={"Username"}
            type={"text"}
            name={"username"}
            handleChange={this.handleChange}
            className={this.hasError("username") ? "is-invalid" : ""}
            errorDiv={this.hasError("username") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a valid username"}
          />

          <Input
            title={"Password"}
            type={"password"}
            name={"password"}
            handleChange={this.handleChange}
            className={this.hasError("password") ? "is-invalid" : ""}
            errorDiv={this.hasError("password") ? "text-danger" : "d-none"}
            errorMsg={"Please enter a password"}
          />

          <hr />
          <button className="btn btn-primary">Login</button>
        </form>
      </Fragment>
    );
  }
}

export default withRouter(Login);
