import React from "react";
import Header from "../components/Header";
import {Input, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import InvokeBackend from "../utils/invokeBackend";
import ModalAddNewGroup from "../components/ModalAddNewGroup";
import invokeBackend from "../utils/invokeBackend";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTrashAlt} from "@fortawesome/free-solid-svg-icons";


class Requests extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            data: [],
            selector: [],
            selectValue: '',
            idAdminGroup: '',
            message: '',
            sendMessage: false,
            phone: '',
            status: false,
            messageStatus: false
        }
    }

    componentDidMount() {
        this.getRequests()
        this.loadGroups()
    }

    loadGroups(){
        invokeBackend.getInvocation('/group/getGroups', data => {
            this.setState({
                selector: data.data
            })
        }, err => {
            alert(err.message)
        })
    }

    getRequests(){
        InvokeBackend.getInvocation(`/users/getRequests`, data => {
            this.setState({
                data: data.data
            })
        }, err => {
            alert('A ocurrido un Error en la consulta: ' + err)
        })
    }
    changeBackdrop = (admin, event) => {
        let {value} = event.target
        this.setState({
            selectValue: value,
            idAdminGroup: admin
        })

    };
    toggleModal(){
        this.setState(
            {
                modal: !this.state.modal
            }
        )
    }

    toggleModalSendMessage(){
        this.setState({
            sendMessage: !this.state.sendMessage
        })
    }
    toggleMessageStatusModal(){
        this.setState({
            messageStatus: !this.state.messageStatus
        })
    }

    render() {
        const {data, selector, message, sendMessage, status, messageStatus} = this.state
        return(
            <div>
                <Header/>
                <button className='btn btn-primary' onClick={()=>{this.toggleModal()}}>Agregar Nuevo Grupo</button>
                <div className='text-center'> <h2> Solicitudes Pendiente </h2> </div>
                <br/>
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
                                <th className='text-center'>Asignar Grupo</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((admin) => (
                                    <tr key={admin.idAdminGroup}>
                                        <th scope='row'>{admin.idAdminGroup}</th>
                                        <td>{admin.country}</td>
                                        <td>{admin.province}</td>
                                        <td>{admin.municipality}</td>
                                        <td>{admin.city}</td>
                                        <td>{admin.cologne}</td>
                                        <td>{admin.admin}</td>
                                        <td>{admin.phoneAdmin}</td>
                                        <td>{admin.emailAdmin}</td>
                                        <td>{admin.postalCode}</td>
                                        <td>
                                            <Input
                                                type="select"
                                                name="backdrop"
                                                id="backdrop"
                                                onChange={()=>{this.changeBackdrop(admin.idAdminGroup, event)}}
                                            >
                                                <option value="">Seleccionar Grupo</option>
                                                {
                                                    selector.map((group)=> (
                                                        <option key={group.idGroup} value={group.idGroup}>
                                                            {group.nameGroup}
                                                        </option>
                                                    ))
                                                }
                                            </Input>
                                        </td>
                                        <td>
                                            <button className='btn btn-primary' onClick={()=>{this.saveAdmin()}}> <FontAwesomeIcon icon={faSave}/> </button>
                                            {' '}
                                            <button className='btn btn-danger'
                                                    onClick={()=>{
                                                        this.setState({
                                                            idAdminGroup: admin.idAdminGroup,
                                                            phone: admin.phoneAdmin
                                                        })
                                                        this.toggleModalSendMessage()}}
                                                    >
                                                <FontAwesomeIcon icon={faTrashAlt}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>

                {
                    this.state.modal && <ModalAddNewGroup/>
                }

                <Modal isOpen={sendMessage}>
                    <ModalHeader>
                        Agrege un mensaje del porque no acepta la Solicitud
                    </ModalHeader>
                    <ModalBody>
                        <div className="col-md-12">
                            <label htmlFor="validationDefault01" className="form-label">Mensaje</label>
                            <textarea className="form-control" id="validationDefault01" name='message'
                                   value={message} onChange={this.handleChange.bind(this)} required/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-primary' onClick={()=>{message?(this.sendMessage(), this.toggleModalSendMessage()): null}}>Enviar Mensaje</button>
                        <button className='btn btn-secondary' onClick={()=>{this.toggleModalSendMessage()}}>Cerrar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={messageStatus}>
                    <ModalHeader>
                        {status?'Mensaje':'Mensaje de Error'}
                    </ModalHeader>
                    <ModalBody>
                        {message}
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-secondary' onClick={()=>{this.toggleMessageStatusModal()}}>Cerrar</button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    handleChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    async sendMessage(){
        const {message, idAdminGroup, phone} = this.state
        console.log(message, idAdminGroup)

        await invokeBackend.deleteInvocation(`/users/deleteAdmin/${idAdminGroup}/${message}/${phone}`, data => {
            this.setState({
                message: data.message,
                status: data.status
            })
            this.getRequests()
            this.toggleMessageStatusModal()
        }, error =>{
            console.log(error.message)
        })
    }

    saveAdmin(){
        const {selectValue, idAdminGroup} = this.state
        let group = {
            idGroup: selectValue,
            idAdmin: idAdminGroup
        }
        invokeBackend.posInvocation(`/users/updateAdmin`, group, data => {
            alert(data.message)
            this.getRequests()
        }, err => {
            alert(err.message)
        })
    }

}
export default Requests;
