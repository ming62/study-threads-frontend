import React, { Component, Fragment } from "react";
import "./styles/EditThread.css";
import Input from "./form-components/input.tsx";
import TextArea from "./form-components/textArea.tsx";
import Select from "./form-components/Select.tsx";
import Alert from "./ui-components/Alert.tsx";
import { withRouter } from "./WithRouter.tsx";
import { Link } from "react-router-dom";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

interface ThreadProps {
  id: number;
  title: string;
  categories?: any;
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
  categoryOptions: any[];
  errors: string[];
  alert: {
    type: string;
    message: string;
  };
  userID: number;
}

class EditThread extends Component<{ [key: string]: any }, ThreadsStateProps> {
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
      alert: {
        type: "d-none",
        message: "",
      },
      userID: this.props.userID,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (evt: any) => {
    evt.preventDefault();

    let errors: string[] = [];
    if (this.state.thread.title === "") {
      errors.push("title");
    }

    this.setState({ errors: errors });

    if (this.state.thread.content === "") {
      errors.push("content");
    }

    if (this.state.thread.category === "") {
      errors.push("category");
    }
    

    this.setState({ errors: errors });

    if (errors.length > 0) {
      return false;
    }

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());

    payload.category = parseInt(payload.category as string);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + this.props.jwt);

    const requestOptions = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: myHeaders,
    };

    fetch("http://localhost:4000/v1/editthread", requestOptions)
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
            this.props.router.navigate("/threads/" + this.state.thread.id);
          }, 1500);
        }
      });
  };

  handleChange = (evt: any) => {
    let value = evt.target.value;
    let name = evt.target.name;
    this.setState((prevState) => ({
      thread: {
        ...prevState.thread,
        [name]: value,
      },
    }));
  };

  hasError(key: string) {
    return this.state.errors.indexOf(key) !== -1;
  }

  componentDidMount() {
    const id = window.location.pathname.split("/").pop();
    const threadId = id ? parseInt(id, 10) : 0;

    fetch("http://localhost:4000/v1/thread/" + threadId)
      .then((response) => {
        if (response.status !== 200) {
          let err = new Error();
          err.message = "Invalid response code: " + response.status;
          this.setState({ error: err });
        }
        return response.json();
      })
      .then((json) => {

        if (this.state.userID !== json.thread.author_id) {
          this.setState({
            alert: {
              type: "alert-danger",
              message: "You do not have access to edit this thread.",
            },
          });
          setTimeout(() => {
            this.props.router.navigate("/threads");
          }, 1500);
        }
        const categoryId = Object.keys(json.thread.categories)[0];
        this.setState(
          {
            thread: {
              id: json.thread.id,
              title: json.thread.title,
              content: json.thread.content,
              upvotes: json.thread.upvotes,
              author_name: json.thread.author_name,
              author_id: json.thread.author_id,
              is_solved: json.thread.is_solved,
              category: categoryId
            },
            isLoaded: true,
            error: null,
          },
          () => {
            this.setState({
              isLoaded: true,
            });
          }
        );
      });
  }

  confirmDelete = (e) => {
    if (this.state.userID !== this.state.thread.author_id) {
      this.setState({
        alert: {
          type: "alert-danger",
          message: "You do not have access to delete this thread.",
        },
      });
      setTimeout(() => {
        this.props.router.navigate("/threads");
      }, 1500);
      return;
    }

    confirmAlert({
      title: "Delete Thread?",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + this.props.jwt);

            fetch(
              "http://localhost:4000/v1/deletethread/" +
                this.state.thread.id,
              {
                method: "GET",
                headers: myHeaders,
              }
            )
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
                      message: "Thread deleted",
                    },
                  });
                  this.props.router.navigate("/threads");
                }
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  render(): React.ReactNode {
    let { thread, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <p>Loading...</p>;
    } else {
      return (
        <Fragment>
          <h2>Edit Thread</h2>
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
              errorMsg={"Please enter content"}
            />

            <button className="btn btn-primary">Submit</button>
            <Link to={`/threads/${thread.id}`} className="btn btn-warning ms-1">
              Back
            </Link>

              <a
                href="#!"
                onClick={(e) => this.confirmDelete(e)}
                className="btn btn-danger ms-1"
              >
                Delete
              </a>

          </form>
        </Fragment>
      );
    }
  }
}

export default withRouter(EditThread);
