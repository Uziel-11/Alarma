import React from "react";
import Header from "../components/Header";
import InvokeBackend from "../utils/invokeBackend";
import {decryptData} from "../utils/encriptData";
import {secretKey} from "../../configServer";

class AddUser extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            phone: '',
            name: '',
            alias: '',
            idAdmin: '',
        }
    }

    async componentDidMount() {
        await this.getIdAdmin()
    }

    async getIdAdmin(){
        try {
            const token = {
                token: await decryptData(localStorage.getItem('token').split(',').map(Number), secretKey, localStorage.getItem('ivT').split(',').map(Number))
            }
            await InvokeBackend.posInvocation(`/token/getIdAdmin`, token, data => {
                this.setState({
                    idAdmin: data.idAdmin
                })
            }, error => {
                alert(error.message)
            })
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            this.setState({ isAuthenticated: false, loading: false });
        }
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    sendData(){
        const {password, phone, name, alias, idAdmin} = this.state
        if (!password || !phone || !name || !alias){
            return
        }
        let user = {
            name: name,
            alias: alias,
            phone: phone,
            password: password,
            idAdmin: idAdmin
        }
        InvokeBackend.posInvocation(`/users/newUser`, user, data => {
            alert(data.message)
        }, err => {
            alert(err.message)
        })
    }

    render() {
        const {password, phone, name, alias} = this.state

        return (
            <>
                <Header/>

                <div className='container mt-5'>
                    <div className='row justify-content-center'>
                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-header text-center'> <h4> Agregar Usuario </h4> </div>
                                <div className='card-body'>
                                    <form className='row justify-content-center'>
                                        <div className='form-group'>
                                            <label htmlFor='name' className='form-label'> Nombre Completo </label>
                                            <input type='text'
                                                   id='name'
                                                   className='form-control'
                                                   name='name'
                                                   value={name}
                                                   onChange={this.handleChange.bind(this)}
                                                   required
                                            />
                                        </div>
                                        <br/>
                                        <div className='form-group'>
                                            <label className='form-label' htmlFor='alias'> Alias </label>
                                            <input type='text'
                                                   id='alias'
                                                   className='form-control'
                                                   name='alias'
                                                   value={alias}
                                                   onChange={this.handleChange.bind(this)}
                                                   required
                                            />
                                        </div>
                                        <br/>
                                        <div className='form-group'>
                                            <label className='form-label' htmlFor='phone'> Telefono </label>
                                            <input type='text'
                                                   id='phone'
                                                   className='form-control'
                                                   name='phone'
                                                   value={phone}
                                                   onChange={this.handleChange.bind(this)}
                                                   required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label className='form-label' htmlFor='password'> Contraseña </label>
                                            <input type='text'
                                                   id='password'
                                                   className='form-control'
                                                   name='password'
                                                   value={password}
                                                   onChange={this.handleChange.bind(this)}
                                                   required
                                            />
                                        </div>
                                        <br/>
                                        <div className="col-12 text-center">
                                            <button className="btn btn-primary col-6 mx-auto" style={{margin:"4%",padding:"2%"}} onClick={()=>{this.sendData()}} type="submit">Agregar Usuario</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}

export default AddUser
