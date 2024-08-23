/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
    element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const location = useLocation();
    const token = localStorage.getItem('access_token') || new URLSearchParams(location.search).get('access_token');

    if (!token || token === 'null') {
        return <Navigate to="/" />;
    }

    return element;
};

export default PrivateRoute;
