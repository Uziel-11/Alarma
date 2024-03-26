import React from "react";
import invokeBackend from "../utils/invokeBackend";
import {Input, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import ModalAddNewGroup from "../components/ModalAddNewGroup";
import InvokeBackend from "../utils/invokeBackend";

class Groups extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            updateModal: false,
            deleteModal: false,
            form: {
                idGroup: '',
                nameGroup: '',
            },
            admin: '',
            modal: false,
            selectValue: '',
            idAdminGroup: '',
            newAlarm: false,
            phone: '',
            idAlarm: '',
            deleteGroupModal: false,
            deleteGroup: false,
        }
    }

    componentDidMount() {
        this.getGroups()
    }

    changeBackdrop = (event) => {
        const idGroup = event.target.value;
        const idAdminGroup = event.target.options[event.target.selectedIndex].getAttribute('idadmingroup');
        const admin = event.target.options[event.target.selectedIndex].getAttribute('admin')
        const nameGroup = event.target.options[event.target.selectedIndex].getAttribute('namegroup')

        if (!idAdminGroup && !idGroup){
            this.setState({
                admin: ''
            })
            return
        }

        this.setState({
            form: {
                idGroup: idGroup,
                nameGroup: nameGroup
            },
            idAdminGroup: idAdminGroup,
            admin: admin
        })
    };

    getGroups(){
        invokeBackend.getInvocation('/group/getGroups', data => {
            this.setState({
                data: data.data
            })
        }, err => {
            alert(err.message)
        })
    }

    deleteAlarm(){
        const {idAlarm} = this.state
        invokeBackend.deleteInvocation(`/group/deleteAlarm/${idAlarm}`, data => {
            alert(data.message)
            this.getGroups()
        }, err => {
            alert(err.message)
        })
    }

    deleteGroup(){
        const  {form} = this.state
        InvokeBackend.deleteInvocation(`/group/deleteGroup/${form.idGroup}`, data => {
            alert(data.message)
            this.getGroups()
        }, err => {
            alert(err.message)
        })
    }

    updateGroup(){
        const {form, phone, idAlarm} = this.state
        let group = {
            idGroup: form.idGroup,
            nameGroup: form.nameGroup,
            phone: phone,
            idAlarm: idAlarm
        }
        invokeBackend.posInvocation(`/group/updateGroup`, group, data => {
            alert(data.message)
            this.setState({
                form: {
                    idGroup: '',
                    nameGroup: ''
                },
                phone: '',
                idAlarm: ''
            })
            this.getGroups()
        }, err => {
            alert(err.message)
        })
    }

    handleChange= (e) =>{
        const { name, value } = e.target;
        this.setState({ [name]: value, form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }});
    }

    getInformation = (group) => {
        this.setState({
            phone: group.phone,
            idAlarm: group.idAlarm,
            form: {
                idGroup: group.idGroup,
                nameGroup: group.nameGroup,
            },
            admin: group.admin
        })
    };

    toggleUpdate () {
        this.setState(
            {
                updateModal: !this.state.updateModal,
                admin: ''
            }
        )
    }

    toggleDelete(){
        this.setState({
            deleteModal: !this.state.deleteModal,
            deleteGroupModal: false,
            form: {
                idGroup: '',
                nameGroup: '',
            }
        })
    }

    toggleModal(){
        this.setState(
            {
                modal: !this.state.modal
            }
        )
    }

    toggleNewAlarm(){
        this.setState({
            newAlarm: !this.state.newAlarm,
            phone: ''
        })
    }

    handleSubmit(){
        const {form, phone, idAdminGroup} = this.state

        if (!phone){
            alert('Tiene que llenar todos los campos')
            return
        }
        let alarm = {
            phone: phone,
            idAdminGroup: idAdminGroup,
            idGroup: form.idGroup
        }
        InvokeBackend.posInvocation(`/group/addAlarm`, alarm, data => {
            alert(data.message)
            this.getGroups()
            this.toggleNewAlarm()
        },err => {
            alert(err.message)
        })
    }

    render() {
        const {data, form, updateModal, deleteModal, newAlarm, phone, deleteGroupModal, deleteGroup, admin} = this.state

        return(
            <div>
                <Header/>
               <div className='container-fluid'>
                   <h4 className='text-center'>Alarmas</h4>
                   <div>
                       <button className='btn btn-primary' style={{marginLeft: '0%'}} onClick={()=>{this.toggleModal()}}>Nuevo Grupo</button>
                       <button className='btn btn-secondary' style={{marginLeft: '2%'}} onClick={()=>{this.toggleNewAlarm()}}>Nueva Alarma</button>
                       <button className="btn btn-danger" style={{ marginLeft: '70%' }} onClick={() => {this.toggleDelete(); this.setState({deleteGroupModal: true})}}>
                           <FontAwesomeIcon icon={faTrashAlt} />Eliminar Grupo
                       </button>
                   </div>
                   <Table striped>
                       <thead>
                       <tr>
                           <th>#</th>
                           <th className='text-center'>Nombre del Grupo</th>
                           <th className='text-center'>No. Telefono</th>
                           <th className='text-center'>Codigo Postal</th>
                           <th> Administrador</th>
                           <th></th>
                       </tr>
                       </thead>
                       <tbody>
                       {
                           data.map((group) => (
                               <tr key={group.idAlarm}>
                                   <th scope='row'>{group.idGroup}</th>
                                   <td className='text-center'>{group.nameGroup}</td>
                                   <td className='text-center'>{group.phone?group.phone:'Sin Alarmas'}</td>
                                   <td className='text-center'>{group.postalCode}</td>
                                   <td>{group.admin}</td>
                                   <td style={{textAlign: 'right'}}>
                                       {
                                           group.phone?<div>
                                               <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={() => {this.getInformation(group); this.toggleUpdate() }}>
                                                   <FontAwesomeIcon icon={faEdit} />Editar
                                               </button>
                                               <button type='submit' className="btn btn-danger" style={{ marginLeft: '10px' }} onClick={() => { this.getInformation(group); this.toggleDelete() }}>
                                                   <FontAwesomeIcon icon={faTrashAlt} />Eliminar
                                               </button>
                                           </div>:
                                               <>Agregue una alarma</>
                                       }
                                   </td>

                               </tr>
                           ))
                       }
                       </tbody>
                   </Table>
               </div>

                <Modal isOpen={updateModal} backdrop='static'>
                    <ModalHeader>
                        Actualizar Datos del Grupo {form.idGroup}
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="idGroup">ID</label>
                            <input className="form-control" type="text" name="idGroup" id="idGroup" disabled readOnly value={form?form.idGroup: this.state.data.length+1}/>
                            <br />
                            <label htmlFor="nameGroup">Nombre</label>
                            <input className="form-control" type="text" name="nameGroup" id="nameGroup" onChange={this.handleChange} value={form?form.nameGroup: ''}/>
                            <br />
                            <label htmlFor="phone">Telefono</label>
                            <input className="form-control" type="text" name="phone" id="phone" onChange={this.handleChange} value={phone?phone: ''}/>
                            <br/>
                            <h6>
                                Tenga en cuenta que si cambia el nombre del grupo a esta alarma,
                                se actualizaran los nombres de grupos de las alarmas asociadas
                                con este grupo.
                            </h6>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-primary' onClick={()=>{this.updateGroup(); this.toggleUpdate()}}>Actualizar Datos</button>
                        <button className='btn btn-secondary' onClick={()=> {this.toggleUpdate()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={deleteModal} backdrop='static'>
                    <ModalHeader>
                        {
                            !deleteGroupModal? <div>Eliminar Alarma <span style={{ color: '#0D6EFD' }}>{phone}</span></div>: <div>Desea eliminar el grupo <span style={{ color: '#0D6EFD' }}>{form.nameGroup?form.nameGroup:'?'}</span></div>
                        }
                    </ModalHeader>
                    <ModalBody>
                        {
                            !deleteGroupModal? <div>Esta seguro que desea eliminar la Alarma con Numero: <br/> <h5 className='text-center' style={{ color: '#0D6EFD' }}>{phone}</h5></div>:
                                <Input
                                    type="select"
                                    name="backdrop"
                                    id="backdrop"
                                    onChange={(event) => { this.changeBackdrop( event) }}
                                >
                                    <option value="">Seleccionar Grupo a Eliminar</option>
                                    {
                                        // Filtrar nombres de grupo únicos
                                        [...new Set(data.map(group => group.nameGroup))].map((uniqueName, index) => {
                                            // Obtener el primer grupo correspondiente al nombre único
                                            const group = data.find(group => group.nameGroup === uniqueName);
                                            return (
                                                <option key={index} value={group.idGroup} namegroup={group.nameGroup}>
                                                    {uniqueName}
                                                </option>
                                            );
                                        })
                                    }
                                </Input>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {
                            !deleteGroupModal? <button className='btn btn-danger' onClick={()=> {this.deleteAlarm(); this.toggleDelete()}}> Si </button>:
                                <button className='btn btn-danger' onClick={()=>{
                                    form.nameGroup?this.setState({deleteGroup: !this.state.deleteGroup}):null
                                }}>Eliminar Grupo</button>
                        }
                        <button className='btn btn-primary' onClick={()=> {this.toggleDelete()}}> Cerrar </button>
                    </ModalFooter>
                </Modal>

                {
                    this.state.modal && <ModalAddNewGroup/>
                }

                <Modal isOpen={newAlarm}>
                    <ModalHeader>
                        Agregar Nueva Alarma
                    </ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className='mb-3'>
                                <Input
                                    type="select"
                                    name="backdrop"
                                    id="backdrop"
                                    onChange={(event) => { this.changeBackdrop( event) }}
                                >
                                    <option value="">Seleccionar Grupo</option>
                                    {
                                        // Filtrar nombres de grupo únicos
                                        [...new Set(data.map(group => group.nameGroup))].map((uniqueName, index) => {
                                            // Obtener el primer grupo correspondiente al nombre único
                                            const group = data.find(group => group.nameGroup === uniqueName);
                                            return (
                                                <option key={index} value={group.idGroup} idadmingroup={group.idAdminGroup} admin={group.admin}>
                                                    {uniqueName}
                                                </option>
                                            );
                                        })
                                    }
                                </Input>
                            </div>
                            <div className="mb-3">
                                <input
                                    type='phone'
                                    id='phone'
                                    name='phone'
                                    className="form-control"
                                    placeholder='Telefono del Grupo'
                                    value={phone}
                                    onChange={this.handleChange.bind(this)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="admin">Administrador</label>
                                <input
                                    type='text'
                                    id='admin'
                                    name='admin'
                                    className="form-control"
                                    placeholder='Administrador'
                                    value={admin}
                                    disabled
                                />
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <div className="text-center">
                            <button type='submit' className="btn btn-primary" onClick={()=>{this.handleSubmit()}}>Agregar Alarma</button>
                        </div>
                        <div className="text-center">
                            <button onClick={()=>{this.toggleNewAlarm(); this.setState({admin: ''})}} className="btn btn-primary">Cerrar</button>
                        </div>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={deleteGroup}>
                    <ModalHeader> Eliminar Grupo <span style={{ color: '#0D6EFD' }}>{form.nameGroup}</span> </ModalHeader>
                    <ModalBody>
                        <div>
                            Esta Seguro que desea eliminar el grupo: <br/> <br/> <h5 className='text-center' style={{ color: '#0D6EFD' }}>{form.nameGroup}</h5>.<br /> <br/>
                            Tenga en cuenta que al eliminar este grupo, se eliminaran todas las alarmas asociadas con este grupo.
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-danger' onClick={()=> {this.deleteGroup(); this.toggleDelete(); this.setState({deleteGroup: !this.state.deleteGroup})}}> Si </button>
                        <button className='btn btn-secondary' onClick={()=> {this.setState({deleteGroup: !this.state.deleteGroup})}}> No </button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Groups
