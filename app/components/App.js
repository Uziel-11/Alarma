import React from "react";
import {BrowserRouter, Switch,Route, Redirect} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import AddGroup from "../pages/addGroup";
import Map from "../pages/MapComponent"
import Report from "../pages/Report";
import NotFound404 from "../pages/NotFound404";
import HighAdmin from "../pages/HighAdmin";
import InvokeBackend from "../utils/invokeBackend";
import {decryptData} from "../utils/encriptData";
import {secretKey} from "../../configServer";
import Requests from "../pages/Requests";
import Groups from "../pages/Groups";
import Admins from "../pages/Admins";
import AddUser from "../pages/AddUser";
import Users from "../pages/Users";

class App extends React.Component{

    state = {
        isAuthenticated: false,
        loading: true,
        isAdmin: false,
        isSuperAdmin: false
    };

    async componentDidMount() {
        await this.isAuthorised();
    }

    async isAuthorised (){
        try {
            const token = {
                // token: await decryptData(localStorage.getItem('token').split(',').map(Number), secretKey, localStorage.getItem('ivT').split(',').map(Number))
                token: localStorage.getItem('token')
            }


            if (token.token){
                await InvokeBackend.posInvocation(`/token/validateToken`, token, data => {
                    this.setState({
                        isAuthenticated: data.isAuthenticated,
                        loading: data.loading,
                        isAdmin: data.isAdmin,
                        isSuperAdmin: data.isSuperAdmin                })
                }, error => {
                    alert(error.message)
                    localStorage.clear()
                    window.location.reload()
                })
            }else {
                this.setState({
                    isAuthenticated: false,
                    loading: false
                })
            }
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            this.setState({ isAuthenticated: false, loading: false });
        }
    }

    render() {
        const { isAuthenticated, loading, isAdmin, isSuperAdmin } = this.state;

        if (loading) {
            // Puedes renderizar un spinner de carga mientras se verifica la autenticación
            return <div>Cargando...</div>;
        }

        return(

           <div>
               <BrowserRouter>
                   <Switch>

                       <Route exact path='/' render={()=>(<Redirect to="/Home"/>)}/>
                       <ValidateLogin exact path='/Login' component={Login} isAuthenticated={isAuthenticated}/>
                       <ProtectedRoute exact path='/Home' component={Home} isAuthenticated={isAuthenticated}/>
                       <ProtectedRouteAdmin exact path="/Alta" component={AddUser} isAuthenticated={isAdmin}/>
                       <ProtectedRouteAdmin exact path='/Mapa' component={Map} isAuthenticated={isSuperAdmin}/>
                       <ProtectedRouteAdmin exact path='/Reporte' component={Report} isAuthenticated={isAdmin}/>
                       <ProtectedRouteAdmin exact path='/Solicitudes' component={Requests} isAuthenticated={isSuperAdmin}/>
                       <ProtectedRouteAdmin exact path='/Grupos' component={Groups} isAuthenticated={isSuperAdmin}/>
                       <ProtectedRouteAdmin exact path='/Administradores' component={Admins} isAuthenticated={isSuperAdmin}/>
                       <ProtectedRouteAdmin exact path='/Usuarios' component={Users} isAuthenticated={isSuperAdmin}/>
                       <Route exact path='/altaAdministrador' component={HighAdmin}/>
                       <Route component={NotFound404}/>
                   </Switch>
               </BrowserRouter>
           </div>

        )
    }
}

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


export default App;
