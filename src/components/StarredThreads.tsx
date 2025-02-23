import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CategoryBadge from './ui-components/CategoryBadge.tsx';

export default function StarredThreads({ userID }) {
  interface Thread {
    id: number;
    title: string;
    content: string;
    author_id: number;
    author_name: string;
    created_at: string;
    categories: { [key: number]: string };
  }



  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();



  useEffect(() => {
    if (userID === 0 || userID === null) {
        navigate('/login');
        return;
      }

    const fetchThreads = () => {

      fetch(`http://localhost:4000/v1/starred/${userID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch threads');
          }
          return response.json();
        })
        .then((data) => {
          setThreads(data.threads);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetchThreads();
  }, [userID,navigate]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div>
      <h1>Your Threads</h1>
      {threads && threads.length > 0 ? (
        threads.map(thread => (
          <Card key={thread.id} className="mb-3">
            <Card.Body>
              <Card.Title>
                <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
              </Card.Title>
              <div className="float-start">
                {Object.values(thread.categories).map((c, index) => (
                  <CategoryBadge category={c} key={index} />
                ))}
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">No threads found.</Alert>
      )}
    </div>
  );
}



