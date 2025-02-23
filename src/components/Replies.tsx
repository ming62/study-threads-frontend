import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Spinner, Alert, Card, Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";

interface ReplyProps {
  id: number;
  thread_id: number;
  content: string;
  author_id: number;
  author_name: string;
  created_at: string;
  is_answer: boolean;
}

const Replies: React.FC<{
  threadID: number;
  userID: number;
  jwt: string;
  threadAuthorID: number;
}> = ({ threadAuthorID, threadID, userID, jwt }) => {
  const [replies, setReplies] = useState<ReplyProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/v1/replies/` + threadID
        );
        if (!response.ok) {
          throw new Error("Failed to fetch replies");
        }
        const data = await response.json();
        if (!Array.isArray(data.replies) || data.replies.length === 0) {
          return <Alert variant="info">No replies found.</Alert>;
        }
        setReplies(data.replies);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [threadID]);

  const confirmDeleteReply = (replyID: number) => {
    confirmAlert({
      title: "Delete Reply?",
      message: "Are you sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + jwt);

            fetch(`http://localhost:4000/v1/deletereply/${replyID}`, {
              method: "GET",
              headers: myHeaders,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.error) {
                  setError(data.error.message);
                } else {
                  window.location.reload();
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

  const toggleAnswer = (replyID: number) => {
    fetch(`http://localhost:4000/v1/toggleanswer/${replyID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to toggle answer");
        }
        return response.json();
      })
      .then((updatedReply) => {
        setReplies(
          replies.map((reply) =>
            reply.id === updatedReply.id ? updatedReply : reply
          )
        );
        window.location.reload();
      })
      .catch((err) => {
        setError((err as Error).message);
      });
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div className="replies">
      {replies &&
        replies.map((reply) => (
          <Card key={reply.id} className="mb-3">
            <Card.Body>
              <Card.Text>
                <strong>Author Name:</strong> {reply.author_name}
              </Card.Text>
              <Card.Text>
                <strong>Author ID:</strong> {reply.author_id}
              </Card.Text>
              <Card.Text>
                <strong>Content:</strong> {reply.content}
              </Card.Text>
              <Card.Text>
                <strong>Created At:</strong>{" "}
                {new Date(reply.created_at).toLocaleString()}
              </Card.Text>
              <Card.Text>
                <strong>Is Answer:</strong> {reply.is_answer ? "Yes" : "No"}{" "}
              </Card.Text>
              {userID === reply.author_id && (
                <Button
                  variant="danger"
                  onClick={() => confirmDeleteReply(reply.id)}
                >
                  Delete
                </Button>
              )}
              {userID === threadAuthorID && (
                <Button
                  variant="primary"
                  onClick={() => toggleAnswer(reply.id)}
                >
                  {reply.is_answer ? "Unmark as Answer" : "Mark as Answer"}
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
    </div>
  );
};

export default Replies;
