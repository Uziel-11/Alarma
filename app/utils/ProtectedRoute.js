import React, {useEffect, useState} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {decryptData} from "./encriptData";
import {secretKey} from "../../configServer";

// Componente de protección de rutas
const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => {

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to="/Login" />;
                }
            }}
        />
    );
};


const ProtectedRouteAdmin = ({ component: Component, isAuthenticated, ...rest }) => {

    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated) {
                    return <Component {...props} />;
                } else {
                    return <Redirect to="/Home" />;
                }
            }}
        />
    );
};

const ValidateLogin = ({component: Component,isAuthenticated, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated) {
                    return <Redirect to="/Home" />;
                } else {
                    return <Component {...props} />;
                }
            }}
        />
    );
}

export {ProtectedRoute, ProtectedRouteAdmin, ValidateLogin};
