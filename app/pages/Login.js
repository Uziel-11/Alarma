import React from 'react';
import bd from "../utils/invokeBackend";
import {secretKey} from "../../configServer";
import {encryptData} from "../utils/encriptData";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            name: '',
            pushHome: false
        };
    }


    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, password } = this.state;

        // Validar que los campos no estén vacíos
        if (username.trim() === '' || password.trim() === '') {
            alert('Por favor, completa todos los campos.');
            return;
        }

    };

    render() {
        const { username, password } = this.state;
        const cumple = false

        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header text-center"> <h4> Inicio de Sesion </h4> </div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit} className="row justify-content-center">
                                    <div className="form-group">
                                        <label htmlFor="username">Numero de Telefono</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            value={username}
                                            onChange={this.handleInputChange.bind(this)}
                                        />
                                        <br/>
                                        <div className='label-error' ref={self => this.label = self}/>                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={this.handleInputChange.bind(this)}
                                        />
                                    </div>
                                    {this.state.username !== 'admin' &&
                                        <button onClick={this.initSesion.bind(this)} type="submit" className="btn btn-primary col-6 mx-auto" style={{margin:"6%",padding:"2%"}}>
                                            Iniciar Sesion
                                        </button>
                                    }
                                </form>
                                {/*{this.state.username === 'admin' && this.state.password && (*/}
                                {/*    <div className='text-center'>*/}
                                {/*        <button onClick={this.highUser.bind(this)}   type="submit" className="btn btn-primary col-6 mx-auto" style={{margin:"6%",padding:"2%"}}>*/}
                                {/*            Alta Usuario*/}
                                {/*        </button>*/}
                                {/*    </div>*/}
                                {/*)}*/}
                                <div className='text-center'>
                                    <button onClick={this.registerAsAdmin.bind(this)}   type="submit" className="btn btn-primary col-6 mx-auto" style={{margin:"6%",padding:"2%"}}>
                                        Registrate como Administrador
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // validateUserName(){
    //     let user = this.state.username
    //
    //     bd.getInvocation(`/users/validateUserName/${user}`,
    //         data => {
    //             this.label.innerHTML = ''
    //         },
    //         error => {
    //             this.label.innerHTML = "El Usuario no Existe"
    //         }
    //
    //     )
    // }

     initSesion () {
        let user = {
            phone: this.state.username,
            password: this.state.password
        }

        bd.posInvocation(`/users/login`, user, async data =>{
            const tokenEncrypt = await encryptData(data.token, secretKey)
            localStorage.setItem('token', tokenEncrypt.encryptedData)
            localStorage.setItem('ivT', tokenEncrypt.iv)
            window.location.reload()
        },
            error => {
            alert(error.message)
        })
    }


    // highUser(){
    //     if (localStorage.length < 2){
    //
    //         let user = {
    //             phone: this.state.username,
    //             password: this.state.password
    //         }
    //         bd.posInvocation(`/users/login`, user, async data => {
    //                 const tokenEncrypt = await encryptData(data.token, secretKey)
    //                 if (data.name === 'admin'){
    //                     this.props.history.push('/Alta')
    //                 }else {
    //                     alert('Necesita ser administrador para poder Acceder')
    //                 }
    //             },
    //             error => {
    //                 alert(error.message)
    //             })
    //     }else {
    //        this.props.history.push('/Alta')
    //     }
    // }

    registerAsAdmin(){
        this.props.history.push('/altaAdministrador')
    }

}

export default Login;
