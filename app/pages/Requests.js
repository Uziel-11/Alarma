import React from "react";
import Header from "../components/Header";
import {Input, Table} from "reactstrap";
import InvokeBackend from "../utils/invokeBackend";
import ModalAddNewGroup from "../components/ModalAddNewGroup";
import invokeBackend from "../utils/invokeBackend";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import data from "bootstrap/js/src/dom/data";

class Requests extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            data: [],
            selector: [],
            selectValue: '',
            idAdminGroup: '',
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

    render() {
        const {data, selector} = this.state
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
                                            <button className='btn btn-danger'> <FontAwesomeIcon icon={faTrashAlt}/> </button>
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
            </div>
        )
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
