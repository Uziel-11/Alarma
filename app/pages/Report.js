import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import invokeBackend from "../utils/invokeBackend";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from 'reactstrap';

import Header from "../components/Header";

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            typeModal: '',
            type:'',
            typeData: '',
            updateModal: false,
            deleteModal: false,
            modal: false,
            editingItemId: null,
            editedReason: '',
            editedActionTaken: '',
            form: {
                idReport: '',
                time: '',
                date: '',
                name: '',
                nameGroup: '',
                phone: '',
                reason: '',
                actionTaken: ''
            }
        };
    }
    componentDidMount() {
        this.loadData()

    }
    loadData(){
        invokeBackend.getInvocation(`/report/getReport`,
            data => {
                this.setState({
                    data: data.data
                })
            },
            err => {
                alert('Aocurrido un Error: ' + err)
            })
    }
    getInformation = (report) => {
        this.setState({
            typeModal: report.reason?'update':null,
            form: {
                idReport: report.idReport,
                time: report.time,
                date: report.date,
                name: report.name,
                nameGroup: report.nameGroup,
                phone: report.phone,
                reason: report.reason,
                actionTaken: report.actionTaken
            },
            type: report.reason?'update': null
        })
    };
    handleSave = () => {
        const {form} = this.state;
        let report = {
            idReport: form.idReport,
            reason: form.reason,
            actionTaken: form.actionTaken,
            type: this.state.type
        }

        console.log(report)
        invokeBackend.posInvocation(`/report/updateReport`, report,
            data => {
                console.log(data.message)
            },
            error => {
                console.log(error.message)
            }
        )
        this.loadData()
    };
    deleteReport(){
        let id = this.state.form.idReport
        invokeBackend.deleteInvocation(`/report/deleteReport/${id}`,data => {
            console.log(data.message)
        }, error => {
            console.log(error.message)
        })
        this.loadData()
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
    toggleUpdate () {
        this.setState({updateModal: !this.state.updateModal})
    }
    toggleDelete(){
        this.setState({deleteModal: !this.state.deleteModal})
    }
    toggleModal(reason){
        this.setState({modal: !this.state.modal, typeData: reason})
    }
    render(){
        const {data, form}=this.state;
        return (
           <div>
               <Header/>
               <div className='text-center'> <h2> Reporte de Activaciones </h2> </div>
               <br/>
               <div className="container-fluid">
                   <Table striped>
                       <thead>
                       <tr>
                           <th>#</th>
                           <th className='text-center'>Hora</th>
                           <th className='text-center'>Fecha</th>
                           <th className='text-center'>Activo</th>
                           <th className='text-center'>Grupo</th>
                           <th className='text-center'>Telefono</th>
                           <th className='text-center'>Razon</th>
                           <th className='text-center'>Accion Tonada</th>
                           <th></th>
                       </tr>
                       </thead>
                       <tbody>
                       {
                           data.map((item) => (
                               <tr key={item.idReport}>
                                   <th scope='row'> { item.idReport} </th>
                                   <td> {item.time} </td>
                                   <td> {item.date} </td>
                                   <td> {item.name} </td>
                                   <td> {item.nameGroup} </td>
                                   <td> {item.phone} </td>
                                   <td> <button type='button' className='btn' onClick={()=>{this.getInformation(item); this.toggleModal('reason')}}> {!item.reason ? item.reason : item.reason.split(' ').slice(0, 5).join(' ')} </button> </td>
                                   <td> <button type='button' className='btn' onClick={()=>{this.getInformation(item); this.toggleModal('actionTaken')}}> {!item.actionTaken ? item.actionTaken : item.actionTaken.split(' ').slice(0, 5).join(' ')} </button> </td>
                                   {/*<td>*/}
                                   {/*    <Form>*/}
                                   {/*        <FormGroup check>*/}
                                   {/*            <Input type='switch' checked={true}>*/}
                                   {/*            </Input>*/}
                                   {/*        </FormGroup>*/}
                                   {/*    </Form>*/}
                                   {/*</td>*/}
                                   <td>
                                       <button className='btn btn-primary' onClick={()=>{this.getInformation(item); this.toggleUpdate()}}> <FontAwesomeIcon icon={faEdit}/>Editar</button>
                                       {"  "}
                                       <button className='btn btn-danger' onClick={()=>{this.getInformation(item); this.toggleDelete()}}> <FontAwesomeIcon icon={faTrashAlt}/>Eliminar </button>
                                   </td>
                               </tr>
                           ))
                       }
                       </tbody>
                   </Table>
               </div>

               {/*Modal para Agregar o Actualizar la Accion Tomada o Razon de la Activacion de la Alarma*/}
               <Modal isOpen={this.state.updateModal} backdrop='static'>
                   <ModalHeader>
                       {this.state.typeModal==='update' ? 'Actualizar ' : 'Agregar '} Datos del Reporte {form.idReport}
                   </ModalHeader>
                   <ModalBody>
                       <div className="form-group">
                           <label htmlFor="idReport">ID</label>
                           <input className="form-control" type="text" name="idReport" id="idReport" disabled readOnly value={form?form.idReport: this.state.data.length+1}/>
                           <br />
                           <label htmlFor="time">Hora</label>
                           <input className="form-control" type="text" name="time" id="time" disabled value={form?form.time: ''}/>
                           <br />
                           <label htmlFor="date">Fecha</label>
                           <input className="form-control" type="text" name="date" id="date" disabled value={form?form.date: ''}/>
                           <br />
                           <label htmlFor="name">Activo</label>
                           <input className="form-control" type="text" name="name" id="name" disabled value={form?form.name:''}/>
                           <br />
                           <label htmlFor="nameGroup">Grupo</label>
                           <input className="form-control" type="text" name="nameGroup" id="nameGroup" disabled value={form?form.nameGroup:''}/>
                           <br />
                           <label htmlFor="phone">Telefono</label>
                           <input className="form-control" type="text" name="phone" id="phone" disabled value={form?form.phone:''}/>
                           <br />
                           <label htmlFor="reason">Razon</label>
                           <textarea className="form-control" type="text" name="reason" id="reason" onChange={this.handleChange} value={form?form.reason:''}/>
                           <br />
                           <label htmlFor="actionTaken">Accion Tomada</label>
                           <textarea className="form-control" type="text" name="actionTaken" id="actionTaken" onChange={this.handleChange} value={form?form.actionTaken:''}/>
                       </div>
                   </ModalBody>
                   <ModalFooter>
                       <button className='btn btn-primary' onClick={()=>{this.handleSave(); this.toggleUpdate()}}>{this.state.typeModal==='update'?'Actualizar': 'Agregar Datos'}</button>
                       <button className='btn btn-secondary' onClick={()=> {this.toggleUpdate()}}>Cancelar</button>
                   </ModalFooter>
               </Modal>

               {/*Modal Para confirmar la eliminacion de un Reporte*/}
               <Modal isOpen={this.state.deleteModal} backdrop='static'>
                   <ModalHeader>
                       Eliminar Reporte {form && form.idReport}
                   </ModalHeader>
                   <ModalBody>
                       Esta seguro que desea eliminar el Reporte {form && form.idReport}
                   </ModalBody>
                   <ModalFooter>
                       <button className='btn btn-danger' onClick={()=> {this.deleteReport(); this.toggleDelete()}}> Si </button>
                       <button className='btn btn-secondary' onClick={()=> {this.toggleDelete()}}> No </button>
                   </ModalFooter>
               </Modal>

               {/*Modal para ver los datos de Accion Tomada o Razon de la Activacion de la Alarma*/}
               <Modal isOpen={this.state.modal} backdrop='static'>
                   <ModalHeader>
                       {    this.state.typeData === 'reason'?
                           `Razon del reporte ${this.state.form.idReport}`:
                           `Accion tomada del Reporte ${this.state.form.idReport}`
                       }
                   </ModalHeader>
                   <ModalBody>
                       {    this.state.typeData === 'reason'?
                           this.state.form.reason :
                           this.state.form.actionTaken
                       }
                   </ModalBody>
                   <ModalFooter>
                       <button className='btn btn-primary' onClick={()=>{this.toggleModal()}}> Cerrar </button>
                   </ModalFooter>
               </Modal>

           </div>
        );
    }
}


export default Report;
