import React from "react";
import location from "../assets/img/ubicacion.png";
import escudo from "../assets/img/proteger.png";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import InvokeBackend from "../utils/invokeBackend";
var texto = "Red";
var texto2 = "Vigia";

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
            isSuperAdmin: false,
            isAuthenticated: false,
        }
    }

    async componentDidMount() {
        await this.getData()
    }

    async getData (){
        try {
            const token = {
                // token: await decryptData(localStorage.getItem('token').split(',').map(Number), secretKey, localStorage.getItem('ivT').split(',').map(Number))
                token: localStorage.getItem('token')
            }

            if(token.token){
                await InvokeBackend.posInvocation(`/token/validateToken`, token, data => {
                    this.setState({
                        isAuthenticated: data.isAuthenticated,
                        isAdmin: data.isAdmin,
                        isSuperAdmin: data.isSuperAdmin
                    })
                }, error => {
                    alert(error.message)
                    localStorage.clear()
                    window.location.reload()
                })
            }
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            this.setState({ isAuthenticated: false, loading: false });
        }
    }

    render() {
        const {isAdmin, isSuperAdmin, isAuthenticated} = this.state
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img src={escudo} alt="Escudo"
                             width="70" height="70" className="d-inline-block align-text-top"/>
                        <span className="d-inline-block">
                            <h4 style={{ color: 'black' }}> {texto} </h4>
                            <h5 style={{ color: 'black' }}> {texto2} </h5>
                        </span>

                    </a>

                    <div className="collapse navbar-collapse justify-content-end m-lg-auto" id="navbarNav" style={{marginRight:"7%"}}>
                        <ul className="navbar-nav" >
                            {
                                (isAdmin || isSuperAdmin) &&
                                <React.Fragment>
                                    <li className="nav-item">
                                        <NavLink  activeStyle={{fontWeight:"bold",color:"#A50000"}} style={{marginLeft:"15px",color:"black", textDecoration: 'none'}} to="/Home">INICIO</NavLink>
                                    </li>
                                    <li className="nav-item" >

                                        <NavLink activeStyle={{fontWeight:"bold",color:"#A50000"}} style={{marginLeft:"15px",color:"black", textDecoration: 'none'}} to="/Reporte">REPORTE</NavLink>
                                    </li>
                                    <li className="nav-item" >

                                        <NavLink activeStyle={{fontWeight:"bold",color:"#A50000"}} style={{marginLeft:"15px",color:"black",textDecoration: 'none'}} to="/Alta">ALTA</NavLink>
                                    </li>
                                    <li className="nav-item" >

                                        <NavLink activeStyle={{fontWeight:"bold",color:"#A50000"}} style={{marginLeft:"15px",color:"black", textDecoration: 'none'}} to="/Usuarios">USUARIOS</NavLink>
                                    </li>
                                </React.Fragment>
                            }
                            {
                                (isSuperAdmin && isAdmin) &&
                                <React.Fragment>
                                    <li className="nav-item">

                                        <NavLink activeStyle={{fontWeight:"bold",color:"#A50000"}} style={{marginLeft:"15px",color:"black",textDecoration: 'none'}} to="/Solicitudes">SOLICITUDES</NavLink>
                                    </li>
                                    <li className="nav-item" >
                                        <NavLink activeStyle={{fontWeight:"bold",color:"#A50000"}} style={{marginLeft:"15px",color:"black", textDecoration: 'none'}} to="/Administradores">ADMINISTRADORES</NavLink>
                                    </li>
                                    <li className="nav-item" >

                                        <NavLink activeStyle={{fontWeight:"bold",color:"#A50000"}} style={{marginLeft:"15px",color:"black", textDecoration: 'none'}} to="/Mapa">MAPA</NavLink>
                                    </li>
                                    <li className="nav-item" >

                                        <NavLink activeStyle={{fontWeight:"bold",color:"#A50000"}} style={{marginLeft:"15px",color:"black", textDecoration: 'none'}} to="/Grupos">GRUPOS</NavLink>
                                    </li>
                                </React.Fragment>
                            }
                        </ul>
                        {
                            isAuthenticated &&
                            <button className='btn' style={{marginLeft:"15px",color:"red",fontWeight:'bold',textDecoration: 'none'}} onClick={()=>{this.signOff()}}><FontAwesomeIcon icon={faSignOutAlt} spin/> CERRAR SESION</button>
                        }
                    </div>

                    <div>
                        <ul className="navbar-brand ">
                            <span className = "d-inline-block">
                                <h4 style={{ color: 'black' }}> Tuxtla </h4>
                                <h6 style={{ color: 'black' }}> Gutierrez </h6>
                            </span>
                            <img src={location} alt="Location"
                                 className="d-inline-block align-top" width="55" height="55" style={{marginLeft:"10%"}}/>
                        </ul>
                    </div>
                </div>
            </nav>

        )
    }


    signOff(){
        localStorage.clear()
        window.location.reload()
    }
}

export default Header;

