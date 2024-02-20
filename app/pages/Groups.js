import React from "react";
import invokeBackend from "../utils/invokeBackend";
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";

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
                numAlarm: ''
            }
        }
    }
    componentDidMount() {
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
    deleteGroup(){
        invokeBackend.deleteInvocation(`/group/deleteGroup/${this.state.form.idGroup}`, data => {
            alert(data.message)
        }, err => {
            alert(err.message)
        })
        this.getGroups()
    }

    updateGroup(){
        const {form} = this.state
        let group = {
            idGroup: form.idGroup,
            nameGroup: form.nameGroup,
            numAlarm: form.numAlarm
        }
        invokeBackend.posInvocation(`/group/updateGroup`, group, data => {
            alert(data.message)
        }, err => {
            alert(err.message)
        })
        this.getGroups()
    }

    handleChange= (e) =>{
        e.persist();
        this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    getInformation = (group) => {
        this.setState({
            form: {
                idGroup: group.idGroup,
                nameGroup: group.nameGroup,
                numAlarm: group.numAlarm,
            },
        })
    };

    toggleUpdate () {
        this.setState({updateModal: !this.state.updateModal})
    }

    toggleDelete(){
        this.setState({deleteModal: !this.state.deleteModal})
    }

    render() {
        const {data, form, updateModal, deleteModal} = this.state

        return(
            <div>
                <Header/>
               <div className='container-fluid'>
                   <Table striped>
                       <thead>
                       <tr>
                           <th>#</th>
                           <th className='text-center'>Nombre del Grupo</th>
                           <th className='text-center'>No. Telefono</th>
                           <th className='text-center'>Codigo Postal</th>
                           <th></th>
                       </tr>
                       </thead>
                       <tbody>
                       {
                           data.map((group) => (
                               <tr key={group.idGroup}>
                                   <th scope='row'>{group.idGroup}</th>
                                   <td className='text-center'>{group.nameGroup}</td>
                                   <td className='text-center'>{group.numAlarm}</td>
                                   <td className='text-center'>{group.postalCode}</td>
                                   <td style={{textAlign: 'right'}}>
                                       <button className='btn btn-primary' onClick={()=>{this.getInformation(group); this.toggleUpdate()}}> <FontAwesomeIcon icon={faEdit}/>Editar</button>
                                       {'   '}
                                       <button type='submit' className="btn btn-danger" onClick={()=>{this.getInformation(group); this.toggleDelete()}}> <FontAwesomeIcon icon={faTrashAlt}/>Eliminar </button>
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
                            <label htmlFor="numAlarm">Telefono</label>
                            <input className="form-control" type="text" name="numAlarm" id="numAlarm" onChange={this.handleChange} value={form?form.numAlarm: ''}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-primary' onClick={()=>{this.updateGroup(); this.toggleUpdate()}}>Actualizar Datos</button>
                        <button className='btn btn-secondary' onClick={()=> {this.toggleUpdate()}}>Cancelar</button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={deleteModal} backdrop='static'>
                    <ModalHeader>
                        Eliminar Grupo {form && form.nameGroup}
                    </ModalHeader>
                    <ModalBody>
                        Esta seguro que desea eliminar el Grupo {form && form.nameGroup}
                    </ModalBody>
                    <ModalFooter>
                        <button className='btn btn-danger' onClick={()=> {this.deleteGroup(); this.toggleDelete()}}> Si </button>
                        <button className='btn btn-secondary' onClick={()=> {this.toggleDelete()}}> No </button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Groups
