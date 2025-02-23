import React, { Component, Fragment } from "react";
import "./styles/EditThread.css";
import Input from "./form-components/input.tsx";
import TextArea from "./form-components/textArea.tsx";
import Alert from "./ui-components/Alert.tsx";
import { withRouter } from "./WithRouter.tsx";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Link } from "react-router-dom";
import Select from "./form-components/Select.tsx";

interface ThreadProps {
  id: number;
  title: string;
  content?: string;
  category?: string;
  author_name?: string;
  author_id?: number;
  upvotes?: number;
  is_solved?: boolean;
}

interface ThreadsStateProps {
  thread: ThreadProps;
  isLoaded: boolean;
  error: Error | null;
  userID: number;
  username: string;
  categoryOptions: any[];
  errors: string[];
  alert: {
    type: string;
    message: string;
  };
}

class NewThread extends Component<{ [key: string]: any }, ThreadsStateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      thread: {
        id: 0,
        title: "",
        content: "",
        category: "",
      },
      categoryOptions: [
        { id: "1", value: "Arts" },
        { id: "2", value: "Business" },
        { id: "3", value: "Computing" },
        { id: "4", value: "Engineering" },
        { id: "5", value: "Law" },
        { id: "6", value: "Medicine" },
        { id: "7", value: "Music" },
        { id: "8", value: "Science" },
      ],
      errors: [],
      isLoaded: false,
      error: null,
      userID: this.props.userID,
      username: this.props.username,
      alert: {
        type: "d-none",
        message: "",
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(evt: any) {
    const { name, value } = evt.target;
    this.setState((prevState) => ({
      thread: {
        ...prevState.thread,
        [name]: value,
      },
    }));
  }


  handleSubmit(evt: any) {
    evt.preventDefault();

    let validationErrors: string[] = [];
    if (this.state.thread.title === "") {
      validationErrors.push("title");
    }

    if (this.state.thread.content === "") {
      validationErrors.push("content");
    }

    if (this.state.thread.category === "") {
      validationErrors.push("category");
    }

    this.setState({ errors: validationErrors });

    if (validationErrors.length > 0) {
      return false;
    }

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());

    payload.author_id = this.state.userID;
    payload.author_name = this.state.username;
    payload.category = parseInt(payload.category as string);
    console.log("Payload:", payload);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + this.props.jwt);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: myHeaders,
    };

    fetch("http://localhost:4000/v1/newthread", requestOptions)
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
          this.setState({
            alert: {
              type: "alert-success",
              message: "Thread saved",
            },
          });
          setTimeout(() => {
            this.props.router.navigate("/threads/");
          }, 1500);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  hasError(key: string) {
    return this.state.errors.indexOf(key) !== -1;
  }

  componentDidMount() {
      this.setState((prevState) => ({
        ...prevState,
        isLoaded: true,
      }));
      if (this.props.userID === 0) {
        this.setState({
          alert: {
            type: "alert-danger",
            message: "Please log in to create a thread",
          },
        });
        setTimeout(() => {
          this.props.router.navigate("/login");
        }, 3000);
      }
  }

  render() {
    const { thread, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <p>Loading...</p>;
    } else {
      return (
        <Fragment>
          <h2>Create Thread {this.props.userID} </h2>
          <Alert
            alertType={this.state.alert.type}
            alertMessage={this.state.alert.message}
          />

          <hr />
          <form onSubmit={this.handleSubmit}>
            <input
              type="hidden"
              name="id"
              id="id"
              value={thread.id}
              onChange={this.handleChange}
            />


            <Input
              title={"Title"}
              className={this.hasError("title") ? "is-invalid" : ""}
              type={"text"}
              name={"title"}
              id={"title"}
              value={thread.title}
              handleChange={this.handleChange}
              errorDiv={this.hasError("title") ? "text-danger" : "d-none"}
              errorMsg={"Please enter a title"}
            />

            <TextArea
              title={"Content"}
              className={this.hasError("content") ? "is-invalid" : ""}
              name={"content"}
              id={"content"}
              value={thread.content}
              rows={3}
              handleChange={this.handleChange}
              errorDiv={this.hasError("content") ? "text-danger" : "d-none"}
              errorMsg={"Please enter content"}
            />

            <Select
              title={"Category"}
              name={"category"}
              options={this.state.categoryOptions}
              value={thread.category}
              handleChange={this.handleChange}
              placeholder="Choose..."
              errorDiv={this.hasError("category") ? "text-danger" : "d-none"}
              errorMsg={"Please choose a category"}
            />

            <button className="btn btn-primary">Submit</button>
            <Link to={`/home`} className="btn btn-warning ms-1">
              Back
            </Link>
          </form>
        </Fragment>
      );
    }
  }
}

export default withRouter(NewThread);
