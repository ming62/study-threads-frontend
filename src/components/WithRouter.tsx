import { useParams, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';

export function withRouter(Component: any) {
  return function ComponentWithRouterProp(props: any) {
    let params = useParams();
    let navigate = useNavigate();
    let location = useLocation();
    return (
      <Component
        {...props}
        router={{ params, navigate, location }}
      />
    );
  };
}