import React, { useState, useEffect, use } from "react";
import {
  Spinner,
  Alert,
  Card,
  FormControl,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CategoryBadge from "./ui-components/CategoryBadge.tsx";

// interface ThreadProps {
//   id: number;
//   title: string;
// }

// interface ThreadsStateProps {
//   threads: ThreadProps[];
//   isLoaded: boolean;
//   error: Error | null;
// }

export default function Threads({ userID }) {
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchThreads = () => {
      fetch(`http://localhost:4000/v1/threads`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch threads");
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
  }, [userID]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div>
      <div className="mb-4"></div>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search"
          aria-label="Search"
          aria-describedby="basic-addon1"
          value={search}
          onChange={handleSearchChange}
        />
      </InputGroup>

      {filteredThreads.length > 0 ? (
        filteredThreads.map((t) => (
          <Card key={t.id} className="mb-3">
            <Card.Body>
              <Card.Title className="d-flex align-items-center justify-content-between">
                <Link to={`/threads/${t.id}`}>{t.title}</Link>
                <div>
                  {Object.values(t.categories).map((c, index) => (
                    <CategoryBadge category={c} key={index} />
                  ))}
                </div>
              </Card.Title>

              <div className="clearfix"></div>
              <Card.Text>{t.content}</Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
              {t.author_name} on {t.created_at}
            </Card.Footer>
          </Card>
        ))
      ) : (
        <Alert variant="info">No threads found.</Alert>
      )}
    </div>
  );
}

// class Threads1 extends Component<{}, ThreadsStateProps> {
//   state: ThreadsStateProps = {
//     threads: [],
//     isLoaded: false,
//     error: null,
//   };

//   componentDidMount() {
//     fetch("http://localhost:4000/v1/threads")
//       // .then((response) => response.json())
//       .then((response) => {
//         console.log("Status code is", response.status);
//         if (response.status !== 200) {
//           let err = new Error("Invalid response code: " + response.status);
//           this.setState({ error: err });
//         }
//         return response.json();
//       })
//       .then((json) => {
//         this.setState({
//           threads: json.threads as ThreadProps[],
//           isLoaded: true,
//         });
//       })
//       .catch((error: any) => {
//         this.setState({
//           isLoaded: true,
//           error,
//         });
//       });
//   }

//   render() {
//     const { threads, isLoaded, error } = this.state;

//     if (error) {
//       return <div>Error: {error.message}</div>;
//     } else if (!isLoaded) {
//       return <p>Loading...</p>;
//     } else {
//       return (
//         <Fragment>
//           <h2>Threads</h2>

//           <div className="list-group">
//             {threads.map((t) => (
//               <Link
//                 key={t.id}
//                 to={`/threads/${t.id}`}
//                 className="list-group-item list-group-item-action"
//               >
//                 {t.title}
//               </Link>
//             ))}
//           </div>
//         </Fragment>
//       );
//     }
//   }
// }
