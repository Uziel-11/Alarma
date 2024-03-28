import React from "react";
import InvokeBackend from "../utils/invokeBackend";
import Header from "../components/Header";
import {Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import invokeBackend from "../utils/invokeBackend";

class Admins extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modalUsers: false,
            admins: [],
            users: [],
            nameAdmin: '',
            modalDeleteAdmin: false,
            idAdmin: '',
            message: '',
            phone: '',
            data: [],
            group: false,
            idGroup: ''
        }
    }

    componentDidMount() {
        this.getAdmins()
        this.getGroups()
    }

    getGroups(){
        invokeBackend.getInvocation('/group/getGroups', data => {
            this.setState({
                data: data.data
            })
        }, err => {
            alert(err.message)
        })
    }

    getAdmins(){
        InvokeBackend.getInvocation(`/users/getAdmins`, data => {
            this.setState({
                admins: data.data
            })
        }, err => {
            alert(err.message)
        })
    }

    getUsers = (admin) => {
        this.setState({nameAdmin: admin.admin})
        InvokeBackend.getInvocation(`/users/getUsersAdmin/${admin.idAdminGroup}`, data => {
            this.setState({
                users: data.data
            })
        }, err => {
            alert(err.message)
        })
    }

    deleteAdmin(){
        const {idAdmin, message, phone} = this.state
        InvokeBackend.deleteInvocation(`/users/deleteAdmin/${idAdmin}/${message}/${phone}/${1}`, data => {
            console.log(data.message)
            this.setState({message: ''})
            this.getAdmins()
        }, err => {
            console.log(err.message)
        })
    }

    toggleModalUsers(){
        this.setState({
            modalUsers: !this.state.modalUsers
        })
    }

    toggleModalDeleteAdmin(){
        this.setState({
            modalDeleteAdmin: !this.state.modalDeleteAdmin
        })
    }

    toggleGroup(){
        this.setState({
            group: !this.state.group
        })
    }

    changeBackdrop = (event) => {
        const idGroup = event.target.value;
        const idAdminGroup = event.target.options[event.target.selectedIndex].getAttribute('idadmingroup');

        this.setState({
            idGroup: idGroup,
            idAdmin: idAdminGroup
        })
    };

    render() {
        const {admins, modalUsers, nameAdmin, users, modalDeleteAdmin, idAdmin, message, data, group} = this.state
        return(
            <div>
                <Header/>
                <div className='container-fluid'>
                    <h4 className='text-center'> Administradores </h4>
                    <br/>
                    <Table striped>
                        <thead>
                            <tr>
                                {/*<th>#</th>*/}
                                <th className='text-center'>Pais</th>
                                <th className='text-center'>Estado</th>
                                <th className='text-center'>Municipio</th>
                                <th className='text-center'>Ciudad</th>
                                <th className='text-center'>Colonia</th>
                                <th className='text-center'>Nombre Admin.</th>
                                <th className='text-center'>Telefono</th>
                                <th className='text-center'>Correo</th>
                                <th className='text-center'>C.P.</th>
                                <th className='text-center'>Grupo</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            admins.map((admin) => (
                                <tr key={admin.idAdminGroup}>
                                    {/*<th scope='row'>{admin.idAdminGroup}</th>*/}
                                    <td>{admin.country}</td>
                                    <td>{admin.province}</td>
                                    <td>{admin.municipality}</td>
                                    <td>{admin.city}</td>
                                    <td className='text-center'>{admin.cologne}</td>
                                    <td>
                                        <button className='btn' onClick={()=>{this.getUsers(admin);this.toggleModalUsers()}}>{admin.admin}</button>
                                    </td>
                                    <td>{admin.phoneAdmin}</td>
                                    <td>{admin.emailAdmin}</td>
                                    <td>{admin.postalCode}</td>
                                    <td>{admin.nameGroup? admin.nameGroup:
                                            <button className='btn btn-primary' onClick={()=>{this.toggleGroup()}}>Grupo</button>
                                        }
                                    </td>
                                    <td>
                                        <button className='btn btn-primary'><FontAwesomeIcon icon={faBan}/></button>
                                        {' '}
                                        <button className='btn btn-danger'
                                                onClick={()=>{this.toggleModalDeleteAdmin(), this.setState({nameAdmin: admin.admin, idAdmin: admin.idAdminGroup, phone: admin.phoneAdmin})}}>
                                            <FontAwesomeIcon icon={faTrashAlt}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                </div>

                <Modal isOpen={modalUsers} size='lg'>
                    <ModalHeader>
                        Usuarios del Administrador {nameAdmin}
                    </ModalHeader>
                    <ModalBody>
                        <Table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th className='text-center'>Nombre</th>
                                <th className='text-center'>Alias</th>
                                <th className='text-center'>Telefono</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                users.map((user, i) => (
                                    <tr key={user.idUsers}>
                                        <th scope='row'>{i+1}</th>
                                        <td>{user.name}</td>
                                        <td>{user.alias}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <button className='btn btn-danger'> <FontAwesomeIcon icon={faTrashAlt}/> </button>
                                            {' '}
                                            <button className='btn btn-primary'><FontAwesomeIcon icon={faBan}/></button>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={()=> {this.toggleModalUsers()}}>Cerrar</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalDeleteAdmin}>
                    <ModalHeader>
                        Eliminar
                    </ModalHeader>
                    <ModalBody>
                        ¿Esta Seguro que desea eliminar al Administrador {nameAdmin}?
                        <br/>
                        <br/>
                        Escriba un Mensaje el por que la eliminacion
                        <div className="col-md-12">
                            {/*<label htmlFor="validationDefault01" className="form-label">Mensaje</label>*/}
                            <textarea className="form-control" id="validationDefault01" name='message'
                                      value={message} onChange={this.handleChange.bind(this)} required/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-danger' onClick={()=>{this.deleteAdmin(), this.toggleModalDeleteAdmin()}}>Aceptar</button>
                        {' '}
                        <button className='btn btn-secondary' onClick={()=>{this.toggleModalDeleteAdmin()}}>Cerrar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={group}>
                    <ModalHeader>
                        Asignar Grupo
                    </ModalHeader>
                    <ModalBody>
                        Se le recomienda ir al apartado de "Grupos",
                        Crear un nuevo grupo y seleccionar este administrador.
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-secondary' onClick={()=> {this.toggleGroup()}}> Cerrar </button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

}

export default Admins
