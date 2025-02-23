import React, { Fragment, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import NewReply from "./newReply.tsx";
import Replies from "./Replies.tsx";

import Button from "react-bootstrap/Button";
import CategoryBadge from "./ui-components/CategoryBadge.tsx";

interface ThreadProps {
  id: number;
  title: string;
  categories?: any;
  content?: string;
  author_name?: string;
  author_id?: number;
  upvotes?: number;
  is_solved?: boolean;
}

interface OneThreadProps {
  thread: ThreadProps;
  isLoaded: boolean;
  error: Error | null;
  userID: number;
}
export default function OneThread({ userID, username, jwt }) {
  const { id = "" } = useParams();
  const [oneThread, setOneThread] = React.useState<OneThreadProps>({
    thread: { id: 0, title: "" },
    isLoaded: false,
    error: null,
    userID: userID,
  });

  const [showAddReply, setShowAddReply] = React.useState<boolean>(false);
  const [isStarred, setIsStarred] = React.useState<boolean>(false);

  const toggleSolved = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    fetch(`http://localhost:4000/v1/togglesolved/` + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setOneThread({
          thread: json.thread,
          isLoaded: true,
          error: null,
          userID: userID,
        });
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const starThread = () => {
    fetch(`http://localhost:4000/v1/star/${userID}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to star thread");
        }
        return response.json();
      })
      .then(() => {
        setIsStarred(true);
      })
      .catch((err) => {
        console.error("There was a problem with the fetch operation:", err);
      });
  };

  const unstarThread = () => {
    fetch(`http://localhost:4000/v1/unstar/${userID}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to unstar thread");
        }
        return response.json();
      })
      .then(() => {
        setIsStarred(false);
      })
      .catch((err) => {
        console.error("There was a problem with the fetch operation:", err);
      });
  };

  React.useEffect(() => {
    fetch("http://localhost:4000/v1/thread/" + id)
      // .then((response) => response.json())
      .then((response) => {
        console.log("Status code is", response.status);
        if (response.status !== 200) {
          let err = new Error("Invalid response code: " + response.status);
          setOneThread((prevState) => ({ ...prevState, error: err }));
        }
        return response.json();
      })
      .then((json) => {
        setOneThread({
          thread: json.thread,
          isLoaded: true,
          error: null,
          userID: userID,
        });
      })
      .catch((error: any) => {
        setOneThread((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          userID: userID,
        }));
      });

    fetch(`http://localhost:4000/v1/starred/${userID}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const isThreadStarred = data.threads.some(
          (thread: ThreadProps) => thread.id === parseInt(id)
        );
        setIsStarred(isThreadStarred);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, [id, userID, jwt]);

  const thread = oneThread.thread;
  const isLoaded = oneThread.isLoaded;
  const error = oneThread.error;

  if (thread.categories) {
    thread.categories = Object.values(thread.categories);
  } else {
    thread.categories = [];
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <p>Loading...</p>;
  }

  function booleanToString(value: boolean) {
    return value ? "Yes" : "No";
  }

  return (
    <Fragment>
      <h2>Thread: {thread.title} </h2>

      <div className="float-start">
        {thread.categories.map((c: any, index) => (
          <CategoryBadge key={index} category={c} />
        ))}
      </div>

      <div className="clearfix"></div>

      <hr />

      <table className="table table-compact table-striped">
        <thead> </thead>
        <tbody>
          <tr>
            <td>
              <strong>ID:</strong>
            </td>
            <td>{thread.id}</td>
          </tr>
          <tr>
            <td>
              <strong>Title:</strong>
            </td>
            <td>{thread.title}</td>
          </tr>
          <tr>
            <td>
              <strong>Author:</strong>
            </td>
            <td>{thread.author_name}</td>
          </tr>
          <tr>
            <td>
              <strong>Content:</strong>
            </td>
            <td>{thread.content}</td>
          </tr>
          <tr>
            <td>
              <strong>Upvotes:</strong>
            </td>
            <td>{thread.upvotes}</td>
          </tr>
          <tr>
            <td>
              <strong>Solved:</strong>
            </td>
            <td>{booleanToString(thread.is_solved ?? false)}</td>
          </tr>
        </tbody>
      </table>

      <div className="d-flex align-items-center">
        {userID !== 0 && (
          <Button
            variant="primary"
            onClick={() => setShowAddReply(!showAddReply)}
          >
            {showAddReply ? "Hide Reply Form" : "Add a Reply"}
          </Button>
        )}

        {userID !== 0 && (
          <Button
            variant={isStarred ? "danger" : "primary"}
            onClick={isStarred ? unstarThread : starThread}
            className="ms-1"
          >
            {isStarred ? "Unstar" : "Star"}
          </Button>
        )}

        {thread.author_id === userID && (
          <div className="d-flex align-items-center ms-1">
            <Link
              to={`/editthread/${thread.id}`}
              className="btn btn-danger ms-1"
            >
              Edit
            </Link>

            <a
              href="#!"
              onClick={(e) => toggleSolved(e)}
              className="btn btn-danger ms-1"
            >
              {thread.is_solved ? "Mark Unsolved" : "Mark Solved"}
            </a>
          </div>
        )}
      </div>

      {showAddReply && (
        <NewReply
          threadID={thread.id}
          userID={userID}
          username={username}
          onReplyAdded={() => {
            setShowAddReply(false);
            window.location.reload();
          }}
        />
      )}

      <hr />
      <Replies
        threadAuthorID={thread.author_id ?? 0}
        threadID={thread.id}
        userID={userID}
        jwt={jwt}
      />
    </Fragment>
  );
}
