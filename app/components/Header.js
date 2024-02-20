import React from "react";
import location from "../assets/img/ubicacion.png";
import escudo from "../assets/img/proteger.png";
var texto = "Colonia";
var texto2 = "Segura";

class Header extends React.Component {
    render() {
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
}

export default Header;

