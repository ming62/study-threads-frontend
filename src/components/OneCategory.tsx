import React, { useState, useEffect } from "react";
import { Spinner, Alert, Card, FormControl, InputGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CategoryBadge from "./ui-components/CategoryBadge.tsx";

const OneCategory = () => {
  interface Thread {
    id: number;
    title: string;
    content: string;
    author_id: number;
    author_name: string;
    created_at: string;
    categories: { [key: number]: string };
  }

  const { id } = useParams<{ id: string }>();
  const [categoryThreads, setCategoryThreads] = useState<{
    threads: Thread[];
    categoryName: string;
  }>({
    threads: [],
    categoryName: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCategoryThreads = () => {
      let threadsData: Thread[] = [];
      let categoryName = '';

      Promise.all([
        fetch(`http://localhost:4000/v1/threads/${id}`).then((r) => r.json()),
        fetch('http://localhost:4000/v1/categories/').then((r) => r.json()),
      ])
        .then(([jsonThreads, jsonCategories]) => {
          threadsData = jsonThreads.threads;
          const category = jsonCategories.categories.find(
            (c: { id: number }) => c.id === Number(id)
          );
          if (category) {
            categoryName = category.category_name;
          }
          setCategoryThreads({
            threads: threadsData,
            categoryName,
          });
          setLoading(false);
        })
        .catch((error: any) => {
          setCategoryThreads({
            threads: [],
            categoryName: '',
          });
          setError(error.message);
          setLoading(false);
        });
    };

    fetchCategoryThreads();
  }, [id]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredThreads = categoryThreads.threads.filter(
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
      <h1>Category: {categoryThreads.categoryName}</h1>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search"
          value={search}
          onChange={handleSearchChange}
        />
      </InputGroup>
      {filteredThreads.length > 0 ? (
        filteredThreads.map((thread) => (
          <Card key={thread.id} className="mb-3">
            <Card.Body>
              <Card.Title>{thread.title}</Card.Title>
              <div className="float-start mb-3">
                {Object.values(thread.categories).map((c, index) => (
                  <CategoryBadge category={c} key={index} />
                ))}
              </div>
              <div className="clearfix"></div>
              <Card.Text>
                <strong>Author:</strong> {thread.author_name}
              </Card.Text>
              <Card.Text>
                <strong>Created At:</strong> {new Date(thread.created_at).toLocaleString()}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">No threads found.</Alert>
      )}
    </div>
  );
};

export default OneCategory;

// interface ThreadProps {
//     id: number;
//     title: string;
// }

// interface OneCategoryProps {
//     threads: ThreadProps[];
//     isLoaded: boolean;
//     error: Error | null;
//     categoryName: string;
// }

// const OneCategory: React.FC<OneCategoryProps> = () => {
//     const { id = '' } = useParams();
//     const [categoryThreads, setcategoryThreads] = React.useState<OneCategoryProps>({
//         threads: [],
//         isLoaded: false,
//         error: null,
//         categoryName: '',
//     });

//     React.useEffect(() => {
//         let threadsData: ThreadProps[] = [];
//         let categoryName = "";

//         Promise.all([
//           fetch("http://localhost:4000/v1/threads/" + id).then((r) => r.json()),
//           fetch("http://localhost:4000/v1/categories/").then((r) => r.json()),
//         ])
//           .then(([jsonThreads, jsonCategories]) => {
//             threadsData = jsonThreads.threads;
//             const category = jsonCategories.categories.find(
//               (c: { id: number }) => c.id === Number(id)
//             );
//             if (category) {
//               categoryName = category.category_name;
//             }
//             setcategoryThreads({
//               threads: threadsData,
//               isLoaded: true,
//               error: null,
//               categoryName,
//             });
//           })
//           .catch((error: any) => {
//             setcategoryThreads({
//               threads: [],
//               isLoaded: true,
//               error,
//               categoryName: "",
//             });
//           });
//       }, [id]);

//     let threads = categoryThreads.threads;
//     const isLoaded = categoryThreads.isLoaded;
//     const error = categoryThreads.error;
//     const categoryName = categoryThreads.categoryName;

//     if(!threads) {
//         threads = [];
//     }

//     if(error) {
//         return <div>Error: {error.message}</div>;
//     }

//     else if(!isLoaded) {
//         return <p>Loading...</p>;
//     }

//     else {
//         return (
//             <Fragment>
//                 <h2>Category: {categoryName} </h2>

//                 <div className="list-group">
//                     {threads.map( (t) => (

//                             <Link
//                               key={t.id}
//                               to={`/threads/${t.id}`}
//                               className="list-group-item list-group-item-action"
//                             >
//                               {t.title}
//                             </Link>
//                     ))}
//                 </div>

//             </Fragment>
//         );
//     }
// }

// export default OneCategory;
