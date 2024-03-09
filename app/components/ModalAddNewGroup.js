import React from "react";
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import InvokeBackend from "../utils/invokeBackend";

class ModalAddNewGroup extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            newGroup: true,
            groups: false,
            name: '',
            numAlarm: '',
            postalCode: ''
        };
    }

    componentDidMount() {
        InvokeBackend.getInvocation(`/group/getGroups`, data => {
            this.setState({
                data: data.data
            })
        }, err => {
            alert(err.message)
        })
    }

    handleChange(e) {
        const fieldName = e.target.name;
        const value = e.target.value;

        this.setState({
            [fieldName]: value
        });
    }
    handleSubmit() {

        if (this.state.name !== '' && this.state.numAlarm !== ''){

            let group = {
                nameGroup: this.state.name,
                numAlarm: this.state.numAlarm,
                postalCode: this.state.postalCode
            }

            InvokeBackend.posInvocation(`/group/addGroup`, group, data => {
                    console.log(data)
                    alert(data.message)
                    console.log(this.state.name, this.state.numAlarm);

                    this.setState({
                        name: '',
                        numAlarm: ''
                    });
                },
                err => {
                    console.log(err.message)
                }
            )
        }else {
            alert('Llene todos los Campos')
            console.log('Llene todos los campos')
        }
    }

    render() {
        const {data, newGroup, groups} = this.state
        return(
            <div>
                <Modal isOpen={this.state.newGroup}>
                    <ModalHeader>
                        Agregar Nuevo Grupo
                    </ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <div className="mb-3">
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    className="form-control"
                                    placeholder='Nombre del Grupo'
                                    value={this.state.name}
                                    onChange={this.handleChange.bind(this)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type='text'
                                    id='numAlarm'
                                    name='numAlarm'
                                    className="form-control"
                                    placeholder='Telefono del Grupo'
                                    value={this.state.numAlarm}
                                    onChange={this.handleChange.bind(this)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type='text'
                                    id='postalCode'
                                    name='postalCode'
                                    className="form-control"
                                    placeholder='39221'
                                    value={this.state.postalCode}
                                    onChange={this.handleChange.bind(this)}
                                    required
                                />
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <div className="text-center">
                            <button type='submit' className="btn btn-primary" onClick={()=>{this.setState({groups:!groups})}}>Ver Grupos</button>
                        </div>
                        <div className="text-center">
                            <button type='submit' className="btn btn-primary" onClick={()=>{this.handleSubmit()}}>Agregar Grupo</button>
                        </div>
                        <div className="text-center">
                            <button onClick={()=>{this.setState({newGroup: !newGroup}); window.location.reload()}} className="btn btn-primary">Cerrar</button>
                        </div>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={groups}>
                    <ModalHeader>
                        Grupos
                    </ModalHeader>
                    <ModalBody>
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th className='text-center'>Nombre del Grupo</th>
                                    <th className='text-center'>No. Telefono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.map((group) => (
                                        <tr key={group.idGroup}>
                                            <th scope='row'>{group.idGroup}</th>
                                            <td>{group.nameGroup}</td>
                                            <td>{group.numAlarm}</td>
                                            <td>
                                                <button type='submit' className="btn btn-danger"> <FontAwesomeIcon icon={faTrashAlt}/>Eliminar </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <div className="text-center">
                            <button type='submit' className="btn btn-primary" onClick={()=>{this.setState({groups: !groups})}}>Cerrar</button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

}

export default ModalAddNewGroup;
