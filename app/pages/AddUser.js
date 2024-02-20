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

                <div className='col-md-9 mx-auto mt-4'>
                            <div className='card'>
                                <div className='card-header text-center'> <h4> Agregar Usuario </h4> </div>
                                <div className='card-body'>
                                    <form className='row g-3'>
                                        <div className='col-md-6'>
                                            <label className='form-label'> Nombre Completo </label>
                                            <input type='text'
                                                   className='form-control'
                                                   name='name'
                                                   value={name}
                                                   onChange={this.handleChange.bind(this)}
                                                   required/>
                                        </div>
                                        <div className='col-md-6'>
                                            <label className='form-label'> Alias </label>
                                            <input type='text'
                                                   className='form-control'
                                                   name='alias'
                                                   value={alias}
                                                   onChange={this.handleChange.bind(this)}
                                                   required/>
                                        </div>
                                        <div className='col-md-6'>
                                            <label className='form-label'> Telefono </label>
                                            <input type='text'
                                                   className='form-control'
                                                   name='phone'
                                                   value={phone}
                                                   onChange={this.handleChange.bind(this)}
                                                   required/>
                                        </div>
                                        <div className='col-md-6'>
                                            <label className='form-label'> Contraseña </label>
                                            <input type='text'
                                                   className='form-control'
                                                   name='password'
                                                   value={password}
                                                   onChange={this.handleChange.bind(this)}
                                                   required/>
                                        </div>
                                    </form>
                                    <div className="col-12 text-center">
                                        <button className="btn btn-primary" onClick={()=>{this.sendData()}} type="submit">Agregar Usuario</button>
                                    </div>
                                    <br/>
                                </div>
                            </div>
                        </div>

            </>
        );
    }
}

export default AddUser
