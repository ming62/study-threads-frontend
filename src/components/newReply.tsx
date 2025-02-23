import React from 'react';
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

interface NewReplyProps {
    threadID: number;
    userID: number;
    username: string;
    onReplyAdded: () => void;
}

const AddReply: React.FC<NewReplyProps> = ({ threadID, userID, username, onReplyAdded }) => {
    const [replyContent, setReplyContent] = useState<string>('');
    const [replyError, setReplyError] = useState<string | null>(null);
    const [replySuccess, setReplySuccess] = useState<string | null>(null);

    const handleReplyContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReplyContent(e.target.value);
    }

    const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (userID === 0) {
            setReplyError('You must be logged in to add a reply');
            window.location.href = '/login';
            return;
        }

        if (replyContent === '') {
            setReplyError('Please enter a reply');
            return;
        }

        const payload = {
            content: replyContent,
            author_id: userID,
            author_name: username
        };

        fetch(`http://localhost:4000/v1/newreply/${threadID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((json) => {
            setReplyContent("");
            setReplyError(null);
            setReplySuccess("Reply added successfully!");
            onReplyAdded();
          })
          .catch((error) => {
            setReplyError("There was a problem with the fetch operation: " + error.message);
            setReplySuccess(null);
          });
      };

      return (
        <div>
          <h3>Add a Reply</h3>
          <Form onSubmit={handleReplySubmit}>
            <Form.Group controlId="replyContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={replyContent}
                onChange={handleReplyContentChange}
                required
              />
            </Form.Group>
            {replyError && <Alert variant="danger">{replyError}</Alert>}
            {replySuccess && <Alert variant="success">{replySuccess}</Alert>}
            <Button type="submit" variant="primary">Submit Reply</Button>
          </Form>
        </div>
      );



}

export default AddReply;