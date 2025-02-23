import React, { Component, Fragment } from "react";
import Input from "./form-components/input.tsx";
import Alert from "./ui-components/Alert.tsx";
import { withRouter } from "./WithRouter.tsx";

interface SignUpState {
  username: string;
  password: string;
  alert: {
    type: string;
    message: string;
  };
}

interface SignUpProps {
  router: {
    navigate: (path: string) => void;
  };
}

class SignUp extends Component<SignUpProps, SignUpState> {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      alert: {
        type: "d-none",
        message: "",
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    const payload = {
      username: this.state.username,
      password: this.state.password,
    };

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    fetch("http://localhost:4000/v1/signup", requestOptions)
      .then((response) => response.json())
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
          this.props.router.navigate("/login");
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  render() {
    return (
      <Fragment>
        <h2>Sign Up</h2>
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
          />

          <Input
            title={"Password"}
            type={"password"}
            name={"password"}
            handleChange={this.handleChange}
          />

          <hr />
          <button className="btn btn-primary">Sign Up</button>
        </form>
      </Fragment>
    );
  }
}

export default withRouter(SignUp);