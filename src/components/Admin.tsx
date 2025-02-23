import React , { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from "./WithRouter.tsx";

interface ThreadProps {
  id: number;
  title: string;
}

interface ThreadsStateProps {
  threads: ThreadProps[];
  isLoaded: boolean;
  error: Error | null;


}

class Admin extends Component<{ [key: string]: any }, ThreadsStateProps> {

  state: ThreadsStateProps = { 
      threads: [],
      isLoaded: false,
      error: null,

   };

  componentDidMount() {

    if (this.props.jwt === "") {
        this.props.router.navigate("/login");
        return
    }

      fetch("http://localhost:4000/v1/threads")
      // .then((response) => response.json())
      .then((response)=>{
          console.log("Status code is", response.status);
          if(response.status !== 200) {
              let err = new Error("Invalid response code: " + response.status);
              this.setState({ error: err });
          }
          return response.json();
      })
      .then((json)=> {
          this.setState({
              threads: json.threads as ThreadProps[],
              isLoaded: true
          });
      })
      .catch((error: any) => {
          this.setState({
              isLoaded: true,
              error
          });
      })
  };
  
  

  render() {
      const { threads, isLoaded, error } = this.state;

      if(error) {
          return <div>Error: {error.message}</div>;
      }

      else if(!isLoaded) {
          return <p>Loading...</p>;
      }

      else {
      return (
          <Fragment>
              <h2>Admin</h2>

              <div className="list-group">
                  {threads.map( (t) => (
                      
                          <Link
                              key={t.id}
                              to={`/admin/thread/${t.id}`}
                              className='list-group-item list-group-item-action'
                              >
                              {t.title}
                          </Link>
                      
                  ))}
              </div>
          </Fragment>
      );
  }
  }
}

export default withRouter(Admin);