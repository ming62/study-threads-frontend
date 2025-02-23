import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Threads from "./components/Threads.tsx";
import Admin from "./components/Admin.tsx";
import Home from "./components/Home.tsx";
import OneThread from "./components/OneThread.tsx";
import Categories from "./components/Categories.tsx";
import OneCategory from "./components/OneCategory.tsx";
import Login from "./components/Login.tsx";
import EditThread from "./components/EditThread.tsx";
import NewThread from "./components/newThread.tsx";
import SignUp from "./components/SignUp.tsx";
import YourThreads from "./components/YourThreads.tsx";
import StarredThreads from "./components/StarredThreads.tsx";
import {
  Container,
  Row,
  Col,
  Card,
  Tabs,
  Tab,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";

interface AppState {
  jwt: string;
  username: string;
  userID: number;
}

export default class App extends Component<{}, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      jwt: "",
      username: "",
      userID: 0,
    };
    this.handleJWTChange = this.handleJWTChange.bind(this);
  }

  componentDidMount() {
    let t = window.localStorage.getItem("jwt");
    let u = window.localStorage.getItem("username");
    let id = window.localStorage.getItem("user_id");
    if (t && u && id) {
      this.setState({
        jwt: t,
        username: u,
        userID: Number(id),
      });
    }
  }

  handleJWTChange = (jwt, username, userID) => {
    this.setState({ jwt, username, userID });
    window.localStorage.setItem("jwt", jwt);
    window.localStorage.setItem("username", username); // Store as plain string
    window.localStorage.setItem("user_id", userID.toString());
  };

  logout = () => {
    this.setState({ jwt: "", username: "", userID: 0 });
    window.localStorage.removeItem("jwt");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("user_id");
  };

  render(): React.ReactNode {
    let loginLink;
    if (this.state.jwt === "") {
      loginLink = <Link to="/login">Login</Link>;
    } else {
      loginLink = (
        <Link to="/logout" onClick={this.logout}>
          Logout
        </Link>
      );
    }

    return (
      <Router>
         <div className="container">
          <div className="row">
            <div className="col mt-3">
              <h1 className="mt-3">Study Thread userid:{this.state.userID === 0 ? "" :  this.state.userID} </h1>
            </div>
            <div className="col mt-3 text-end">{loginLink}</div>
            
            <hr className="mb-3" />
          </div>

          <div className="'row">
            <div className="col-md-2">
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/home">Home</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/threads">Threads</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/categories">Categories</Link>
                  </li>
                  {this.state.jwt !== "" && (
                    <Fragment>
                      <li className="list-group-item">
                        <Link to="/newthread">Create Thread</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/yourthreads">Your Threads</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/starred">Starred Threads</Link>
                      </li>
                    </Fragment>
                  )}

                </ul>
                <pre>{JSON.stringify(this.state.jwt, null, 3)}</pre>
              </nav>
            </div> 



        <Routes>
          <Route path="/" element={<Threads userID={this.state.userID} />} />
          <Route
            path="/threads"
            element={<Threads userID={this.state.userID} />}
          />
          <Route path="/home" element={<Home />} />
          <Route
            path="/login"
            element={<Login handleJWTChange={this.handleJWTChange} />}
          />
          <Route path="/logout" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/categories"
            element={
              <Categories categories={[]} isLoaded={false} error={null} />
            }
          />
          <Route path="/" element={<Home />} />
          <Route
            path="/editthread/:id"
            element={
              <EditThread userID={this.state.userID} jwt={this.state.jwt} />
            }
          />
          <Route
            path="/newthread"
            element={
              <NewThread
                userID={this.state.userID}
                username={this.state.username}
              />
            }
          />
          <Route
            path="/yourthreads"
            element={<YourThreads userID={this.state.userID} />}
          />
          <Route
            path="/starred"
            element={<StarredThreads userID={this.state.userID} />}
          />
          <Route
            path="/threads/:id"
            element={
              <OneThread
                userID={this.state.userID}
                username={this.state.username}
                jwt={this.state.jwt}
              />
            }
          />
          <Route path="/categories/:id" element={<OneCategory />} />
        </Routes>
          </div>
        </div>
      </Router>
    );
  }
}
