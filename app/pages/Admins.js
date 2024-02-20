import React from "react";
import InvokeBackend from "../utils/invokeBackend";
import Header from "../components/Header";
import {Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";

class Admins extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modalUsers: false,
            admins: [],
            users: [],
            nameAdmin: '',
        }
    }

    componentDidMount() {
        this.getAdmins()
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

    toggleModalUsers(){
        this.setState({
            modalUsers: !this.state.modalUsers
        })
    }

    render() {
        const {admins, modalUsers, nameAdmin, users} = this.state
        return(
            <div>
                <Header/>
                <div className='container-fluid'>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>#</th>
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
                                    <th scope='row'>{admin.idAdminGroup}</th>
                                    <td>{admin.country}</td>
                                    <td>{admin.province}</td>
                                    <td>{admin.municipality}</td>
                                    <td>{admin.city}</td>
                                    <td>{admin.cologne}</td>
                                    <td>
                                        <button className='btn' onClick={()=>{this.getUsers(admin);this.toggleModalUsers()}}>{admin.admin}</button>
                                    </td>
                                    <td>{admin.phoneAdmin}</td>
                                    <td>{admin.emailAdmin}</td>
                                    <td>{admin.postalCode}</td>
                                    <td>{admin.nameGroup}</td>
                                    <td><button className='btn btn-primary'>Suspender</button></td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                </div>

                <Modal isOpen={modalUsers}>
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
                                users.map((user) => (
                                    <tr key={user.idUsers}>
                                        <th scope='row'>{user.idUsers}</th>
                                        <td>{user.name}</td>
                                        <td>{user.alias}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <button className='btn btn-danger'> <FontAwesomeIcon icon={faTrashAlt}/> </button>
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
            </div>
        )
    }


}

export default Admins
