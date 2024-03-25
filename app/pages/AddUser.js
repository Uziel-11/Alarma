import React from "react";
import Header from "../components/Header";
import InvokeBackend from "../utils/invokeBackend";

class AddUser extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            phone: '',
            name: '',
            alias: '',
            idAdmin: '',
            idGroup: '',
            role: '',
            admins: [],
        }
    }

    async componentDidMount() {
        await this.getIdAdmin()
        await this.getAdmins()
    }

    async getIdAdmin(){
        try {
            const token = {
                // token: await decryptData(localStorage.getItem('token').split(',').map(Number), secretKey, localStorage.getItem('ivT').split(',').map(Number))
                token: localStorage.getItem('token')
            }
            await InvokeBackend.posInvocation(`/token/getIdAdmin`, token, data => {
                this.setState({
                    idAdmin: data.idAdmin,
                    idGroup: data.idGroup,
                    role: data.roles
                })
                localStorage.setItem('idAdmin', data.idAdmin)
            }, error => {
                alert(error.message)
            })
        } catch (error) {
            console.error('Error al verificar autenticación:', error);
            this.setState({ isAuthenticated: false, loading: false });
        }
    }

    async getAdmins(){
        await InvokeBackend.getInvocation('/users/getAdmins', data => {
            this.setState({
                admins: data.data
            })
        }, err => {
            console.log(err.message)
        })
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleSelectChange = (event) => {
        const idAdmin = event.target.value;
        const idGroup = event.target.options[event.target.selectedIndex].getAttribute('idgroup');

        this.setState({
            idAdmin: idAdmin,
            idGroup: idGroup
        })
    };

    sendData(){
        const {password, phone, name, alias, idAdmin, idGroup} = this.state
        if (!password || !phone || !name || !alias){
            alert('Llene todos los campos')
            return
        }
        if (!idAdmin){
            alert('No olvide asignarle un Administrador')
            return;
        }
        let user = {
            name: name,
            alias: alias,
            phone: phone,
            password: password,
            idAdmin: idAdmin,
            idGroup: idGroup
        }
        InvokeBackend.posInvocation(`/users/newUser`, user, data => {
            alert(data.message)
        }, err => {
            alert(err.message)
        })
    }

    render() {
        const {password, phone, name, alias, selectedValueGroup, idAdmin, admins, role} = this.state

        return (
            <>
                <Header/>

                <div className='container mt-5'>
                    <div className='row justify-content-center'>
                        <div className='col-md-6'>
                            <div className='card'>
                                <div className='card-header text-center'> <h4> Agregar Usuario </h4> </div>
                                <div className='card-body'>
                                    <form className='row g-1'>
                                        <div className="col-md-12">
                                            <label htmlFor="name" className="form-label">Nombre</label>
                                            <input type="name" className="form-control" id="name" onChange={this.handleChange}
                                                   value={name} name='name' required/>
                                        </div>
                                        <div className='form-group'>
                                            <label className='form-label' htmlFor='alias'> Alias </label>
                                            <input type='alias'
                                                   id='alias'
                                                   className='form-control'
                                                   name='alias'
                                                   value={alias}
                                                   onChange={this.handleChange}
                                                   required
                                            />
                                        </div>
                                        <br/>
                                        <div className='form-group'>
                                            <label className='form-label' htmlFor='phone'> Telefono </label>
                                            <input type='phone'
                                                   id='phone'
                                                   className='form-control'
                                                   name='phone'
                                                   value={phone}
                                                   onChange={this.handleChange}
                                                   required
                                            />
                                        </div>
                                        <div className='form-group'>
                                            <label className='form-label' htmlFor='password'> Contraseña </label>
                                            <input type='password'
                                                   id='password'
                                                   className='form-control'
                                                   name='password'
                                                   value={password}
                                                   onChange={this.handleChange}
                                                   required
                                            />
                                        </div>
                                        <br/>
                                        {
                                            role === 'superadmin' &&
                                            <div className='form-group'>
                                                <label className='form-label' htmlFor='select'></label>
                                                <select
                                                    className="form-select"
                                                    value={selectedValueGroup}
                                                    onChange={(event) => this.handleSelectChange(event)}
                                                >
                                                    <option value={idAdmin}>Seleccione un Administrador</option>
                                                    {admins.map((admin) => (
                                                        <option key={admin.idAdminGroup} value={admin.idAdminGroup} idgroup={admin.idGroup}>
                                                            {admin.admin}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        }
                                        <br/>
                                        <h6>Si desea agregar un Usuario a su cargo, no seleccione a ningun administrador</h6>
                                        <div className="col-12 text-center">
                                            <button className="btn btn-primary col-6 mx-auto" type='button' style={{margin:"4%",padding:"2%"}} onClick={()=>{this.sendData()}}>Agregar Usuario</button>
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
