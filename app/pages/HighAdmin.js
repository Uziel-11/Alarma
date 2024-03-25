import React from "react";
import Header from "../components/Header";
import InvokeBackend from "../utils/invokeBackend";


class HighAdmin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            country: '',
            province: '',
            municipality: '',
            city: '',
            cologne: '',
            admin: '',
            phoneAdmin: '',
            emailAdmin: '',
            postalCode: '',
            password: '',
            phone: '',
            name: '',
            alias: '',
            superAdmin: '',
            persons: []
        }
    }

    componentDidMount() {
        this.searchSuperAdmin()
    }

    addPersons(){
        const {phone, name, alias, password, persons} = this.state
        const newPeople = {name, alias, phone, password}
        if (!phone || !name || !alias || !password){
            // alert('Llene los campos en blanco')
            return
        }
        this.setState({
            persons: [...persons, newPeople],
            phone: '',
            name: '',
            alias: '',
            password: ''
        })

    }

    addAdmin(){
        let roles = ''

        //Comprobando si ya existe un SeperAdministrador
        if (this.state.superAdmin !== 0){
            roles = 'admin'
        }else {
            roles = 'superadmin'
        }
        const {country, province, municipality, city, cologne, admin, phoneAdmin, emailAdmin, postalCode, password, persons} = this.state
        const newAdmin = {country, province, municipality, city, cologne, admin, phoneAdmin, emailAdmin, postalCode, password, roles}
        if (!country || !province || !municipality || !city || !cologne || !admin || !phoneAdmin || !emailAdmin || !postalCode || !password){
            // alert('Llene los campos en blanco')
            return
        }
        this.setState({
            persons: [...persons, newAdmin],
            country: '',
            province: '',
            municipality: '',
            city: '',
            cologne: '',
            admin: '',
            phoneAdmin: '',
            emailAdmin: '',
            postalCode: '',
            password: '',
        })


    }

    sendAdmin(){
        const {country, province, municipality, city, cologne, admin, phoneAdmin, emailAdmin, postalCode, password, superAdmin} = this.state
        let roles = ''
        let accepted = 0

        //Comprobando si ya existe un SeperAdministrador
        if (superAdmin !== 0){
            roles = 'admin'
        }else {
            roles = 'superadmin'
        }
        if (!country || !province || !municipality || !city || !cologne || !admin || !phoneAdmin || !emailAdmin || !postalCode || !password){
            return
        }
        const dataAdmin = [{country, province, municipality, city, cologne, admin, phoneAdmin, emailAdmin, postalCode, password, roles, accepted}]
        InvokeBackend.posInvocation(`/users/newAdmin`, dataAdmin, data => {
            alert(data.message)
            this.props.history.push('/Login')
        }, err => {
            alert(err.message)
        })
        this.setState({
            country: '',
            province: '',
            municipality: '',
            city: '',
            cologne: '',
            admin: '',
            phoneAdmin: '',
            emailAdmin: '',
            postalCode: '',
            password: '',
        })
    }

    sendData(){
        InvokeBackend.posInvocation(`/users/newGroup`, this.state.persons, data =>{
            alert(data.message)
            this.props.history.push('/Login')
        }, error=>{
            alert(error.message)
        })

    }

    sendDataSuperAdmin(){
        InvokeBackend.posInvocation(`/users/superAdmin`, this.state.persons, data => {
            alert(data.message)
            this.props.history.push('/Login')
        }, error => {
            alert(error.message)
        })
    }

    searchSuperAdmin(){
        InvokeBackend.getInvocation(`/users/searchSuperAdmin`,data => {
            this.state.superAdmin = data.data.length
        },error => {
            console.log(error)
        })
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        const {country, province, municipality, city, cologne, admin, phoneAdmin, emailAdmin, postalCode, password, phone, name, alias, persons, superAdmin} = this.state

        return (
            <>
                <Header/>
                <div className='container'>

                    <div className='row'>
                        <div className='col-md-12 mx-auto mt-4'>
                            <div className='card'>
                                <div className="card-header text-center"> <h4> Alta Administrador </h4> </div>
                                <div className='card-body'>
                                    <form className="row g-3">
                                        <div className="col-md-4">
                                            <label htmlFor="validationDefault01" className="form-label">Pais</label>
                                            <input type="text" className="form-control" id="validationDefault01" name='country'
                                                   value={country} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="validationDefault02" className="form-label">Estado o Provincia</label>
                                            <input type="text" className="form-control" id="validationDefault02" name='province'
                                                   value={province} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="validationDefault03" className="form-label">Municipio</label>
                                            <input type="text" className="form-control" id="validationDefault03" name='municipality'
                                                   value={municipality} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="validationDefault04" className="form-label">Ciudad</label>
                                            <input type="text" className="form-control" id="validationDefault04" name='city'
                                                   value={city} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="validationDefault05" className="form-label">Colonia</label>
                                            <input type="text" className="form-control" id="validationDefault05" name='cologne'
                                                   value={cologne} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="validationDefault06" className="form-label">Codigo Postal</label>
                                            <input type="text" className="form-control" id="validationDefault06" name='postalCode'
                                                   value={postalCode} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="validationDefault07" className="form-label">Nombre</label>
                                            <input type="text" className="form-control" id="validationDefault07" name='admin'
                                                   value={admin} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="validationDefaultUsername"
                                                   className="form-label">Correo</label>
                                            <div className="input-group">
                                                <span className="input-group-text" id="inputGroupPrepend2">@</span>
                                                <input type="text" className="form-control" id="validationDefaultUsername" name='emailAdmin'
                                                       aria-describedby="inputGroupPrepend2" value={emailAdmin} onChange={this.handleChange.bind(this)} required/>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="validationDefault08" className="form-label">Telefono</label>
                                            <input type="text" className="form-control" id="validationDefault08" name='phoneAdmin' value={phoneAdmin} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="validationDefault08" className="form-label">Contraseña</label>
                                            <input type="text" className="form-control" id="validationDefault08" name='password' value={password} onChange={this.handleChange.bind(this)} required/>
                                        </div>
                                        <div className="col-12 text-center">
                                            <button className='btn btn-primary' onClick={()=>{this.sendAdmin()}}> Enviar datos</button>
                                        </div>
                                    </form>
                                    <br/>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/*{*/}
                    {/*    persons.length > 0 &&*/}
                    {/*    <div className='col-md-9 mx-auto mt-4'>*/}
                    {/*        <div className='card'>*/}
                    {/*            <div className='card-header text-center'> <h4> Agregar Usuario </h4> </div>*/}
                    {/*            <div className='card-body'>*/}
                    {/*                <form className='row g-3' onSubmit={this.addPersons.bind(this)}>*/}
                    {/*                    <div className='col-md-6'>*/}
                    {/*                        <label className='form-label'> Nombre Completo </label>*/}
                    {/*                        <input type='text'*/}
                    {/*                               className='form-control'*/}
                    {/*                               name='name'*/}
                    {/*                               value={name}*/}
                    {/*                               onChange={this.handleChange.bind(this)}*/}
                    {/*                               required/>*/}
                    {/*                    </div>*/}
                    {/*                    <div className='col-md-6'>*/}
                    {/*                        <label className='form-label'> Alias </label>*/}
                    {/*                        <input type='text'*/}
                    {/*                               className='form-control'*/}
                    {/*                               name='alias'*/}
                    {/*                               value={alias}*/}
                    {/*                               onChange={this.handleChange.bind(this)}*/}
                    {/*                               required/>*/}
                    {/*                    </div>*/}
                    {/*                    <div className='col-md-6'>*/}
                    {/*                        <label className='form-label'> Telefono </label>*/}
                    {/*                        <input type='text'*/}
                    {/*                               className='form-control'*/}
                    {/*                               name='phone'*/}
                    {/*                               value={phone}*/}
                    {/*                               onChange={this.handleChange.bind(this)}*/}
                    {/*                               required/>*/}
                    {/*                    </div>*/}
                    {/*                    <div className='col-md-6'>*/}
                    {/*                        <label className='form-label'> Contraseña </label>*/}
                    {/*                        <input type='text'*/}
                    {/*                               className='form-control'*/}
                    {/*                               name='password'*/}
                    {/*                               value={password}*/}
                    {/*                               onChange={this.handleChange.bind(this)}*/}
                    {/*                               required/>*/}
                    {/*                    </div>*/}
                    {/*                    <div className="col-12 text-center">*/}
                    {/*                        <button className="btn btn-primary" onClick={this.addPersons.bind(this)} type="submit">Agregar Usuario</button>*/}
                    {/*                    </div>*/}
                    {/*                </form>*/}
                    {/*                <br/>*/}
                    {/*                { (superAdmin === 0 || persons.length === 0) &&*/}
                    {/*                    <div className="col-12 text-center">*/}
                    {/*                        <button className="btn btn-primary" onClick={this.sendDataSuperAdmin.bind(this)} type="submit">Guardar Super Administrador</button>*/}
                    {/*                    </div>*/}
                    {/*                }*/}
                    {/*                { persons.length >= 4 &&*/}
                    {/*                    <div className="col-12 text-center">*/}
                    {/*                        <button className="btn btn-primary" onClick={this.sendData.bind(this)} type="submit">Enviar Datos</button>*/}
                    {/*                    </div>*/}
                    {/*                }*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*}*/}

                    {/*<br/>*/}

                    {/*<ul>*/}
                    {/*    {persons.slice(1).map((people, index) => (*/}
                    {/*        <li key={index}> {`${people.name} | ${people.alias} | ${people.phone}`} </li>*/}
                    {/*    ))}*/}
                    {/*</ul>*/}
                </div>
            </>
        );
    }
}

export default HighAdmin;
