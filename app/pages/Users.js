import React from "react";
import Header from "../components/Header";
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import invokeBackend from "../utils/invokeBackend";

class Users extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            idAdmin: '',
            updateModal: false,
            deleteModal: false,
            form: {
                idUsers: '',
                name: '',
                alias: '',
                phone: ''
            }
        }
    }

    async componentDidMount() {
        await this.setState({
            idAdmin: localStorage.getItem('idAdmin')
        })
        this.getUsers()
    }

    getUsers(){
        invokeBackend.getInvocation(`/users/getUsersAdmin/ ${this.state.idAdmin}`, data => {
            this.setState({
                users: data.data
            })
        }, err => {
            alert(err.message)
        })
    }

    getInformation = (users) => {
        this.setState({
            form: {
                idUsers: users.idUsers,
                name: users.name,
                alias: users.alias,
                phone: users.phone
            },
        })
    };

    handleChange= (e) =>{
        e.persist();
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    deleteUser(){
        invokeBackend.deleteInvocation(`/users/deleteUser/${this.state.form.idUsers}`, data => {
            alert(data.message)
        }, err => {
            alert(err.message)
        })
        this.getUsers()
    }

    updateUser(){
        const {form} = this.state
        let user = {
            idUsers: form.idUsers,
            name: form.name,
            alias: form.alias,
            phone: form.phone
        }
        invokeBackend.posInvocation(`/users/updateUser`, user, data => {
            alert(data.message)
        }, err => {
            alert(err.message)
        })
        this.getUsers()
    }

    toggleUpdate () {
        this.setState({updateModal: !this.state.updateModal})
    }

    toggleDelete(){
        this.setState({deleteModal: !this.state.deleteModal})
    }

    render() {
        const {users, form, updateModal, deleteModal} = this.state
        return (
            <>
                <Header/>
                <div>
                    <div className='container-fluid'>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th className='text-center'>Nombre</th>
                                <th className='text-center'>Alias</th>
                                <th className='text-center'>No. Telefono</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                users.map((user) => (
                                    <tr key={user.idUsers}>
                                        <th scope='row'>{user.idUsers}</th>
                                        <td className='text-center'>{user.name}</td>
                                        <td className='text-center'>{user.alias}</td>
                                        <td className='text-center'>{user.phone}</td>
                                        <td style={{textAlign: 'right'}}>
                                            <button className='btn btn-primary' onClick={()=>{this.getInformation(user); this.toggleUpdate()}}> <FontAwesomeIcon icon={faEdit}/>Editar</button>
                                            {'   '}
                                            <button type='submit' className="btn btn-danger" onClick={()=>{this.getInformation(user); this.toggleDelete()}}> <FontAwesomeIcon icon={faTrashAlt}/>Eliminar </button>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </div>
                </div>


                <Modal isOpen={updateModal} backdrop='static'>
                    <ModalHeader>
                        Actualizar Datos del Usuario {form.alias}
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="idUsers">ID</label>
                            <input className="form-control" type="text" name="idUsers" id="idUsers" disabled readOnly value={form?form.idUsers: this.state.data.length+1}/>
                            <br />
                            <label htmlFor="name">Nombre</label>
                            <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={form?form.name: ''}/>
                            <br />
                            <label htmlFor="alias">Alias</label>
                            <input className="form-control" type="text" name="alias" id="alias" onChange={this.handleChange} value={form?form.alias: ''}/>
                            <br />
                            <label htmlFor="phone">Telefono</label>
                            <input className="form-control" type="text" name="phone" id="phone" onChange={this.handleChange} value={form?form.phone: ''}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-primary' onClick={()=>{this.updateUser(); this.toggleUpdate()}}>Actualizar Datos</button>
                        <button className='btn btn-secondary' onClick={()=> {this.toggleUpdate()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={deleteModal} backdrop='static'>
                    <ModalHeader>
                        Eliminar Usuario {form && form.alias}
                    </ModalHeader>
                    <ModalBody>
                        Esta seguro que desea eliminar el Usuario {form && form.name}
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-danger' onClick={()=> {this.deleteUser(); this.toggleDelete()}}> Si </button>
                        <button className='btn btn-secondary' onClick={()=> {this.toggleDelete()}}> No </button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }

}

export default Users;