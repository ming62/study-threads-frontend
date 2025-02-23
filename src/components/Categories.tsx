import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';

interface CategoriesStateProps {
    categories: any[];
    isLoaded: boolean;
    error: Error | null;

}



export default class Categories extends Component<CategoriesStateProps> {

    state: Readonly<CategoriesStateProps> = { 
        categories: [],
        isLoaded: false,
        error: null,

    };

    componentDidMount() {
        fetch("http://localhost:4000/v1/categories")
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
                categories: json.categories,
                isLoaded: true,
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
        const { categories, isLoaded, error } = this.state;

        if(error) {
            return <div>Error: {error.message}</div>;
        }

        else if(!isLoaded) {
            return <p>Loading...</p>;
        }
        
        else {
        return (
            <Fragment>
                <h2>Categories </h2>

                <div className="list-group">
                    {categories.map((c: any) => (
                        
                            <Link 
                                key = {c.id}
                                to={`/categories/${c.id}`}
                                className='list-group-item list-group-item-action'
                                >
                                {c.category_name}
                            </Link>
                        
                    ))}
                </div>
            </Fragment>
        )
    }
}
}