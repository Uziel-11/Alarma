import React from "react";
import "../assets/stylesheets/cardHome.css";
import alarma from "../assets/img/alarma.png";
import activate from "../assets/img/activate.png";
import Socket from "./Socket";
import InvokeBackend from "../utils/invokeBackend";
import {Modal, ModalBody, ModalHeader} from "reactstrap";

class card extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            location: '',
            error: null,
            dateTimeCurrent: new Date(),
            dataUser: [],
            modalMessage: false,
            messageModal: '',
        }
    }

    async componentDidMount() {

        await this.getDataUser()
        // Verificar si el navegador soporta la geolocalización
        // if (navigator.geolocation) {
        //     // Obtener la ubicación actual
        //     navigator.geolocation.getCurrentPosition(
        //         (position) => {
        //             const { latitude, longitude } = position.coords;
        //             this.setState({ location: { latitude, longitude } });
        //             console.log(position.coords)
        //         },
        //         (error) => {
        //             alert("Error obteniendo la ubicación: "+ error.message);
        //         }
        //     );
        // } else {
        //     alert("La geolocalización no está soportada por este navegador.");
        // }
        await this.getLocation()

        this.intervalID = setInterval(
            () => this.updateDateTime(),
            1000
        )

        Socket.on('connect', () => {
            // console.log("Cliente Conectado ", Socket.id)
        })

    }

    async getLocation(){
        await navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.setState({ location: { latitude, longitude } });
            },
            (error) => {
                alert("Error obteniendo la ubicación: "+ error.message);
            }
        );

    }

    componentWillUnmount() {
        //Limpiar el intervalo cuando el componente se desmonta
        clearInterval(this.intervalID)
    }

    async getDataUser(){
        const token = {
            // token: await decryptData(localStorage.getItem('token').split(',').map(Number), secretKey, localStorage.getItem('ivT').split(',').map(Number))
            token: localStorage.getItem('token')
        }
        await InvokeBackend.posInvocation(`/token/getDataUser`, token, data => {
            this.setState({
                dataUser: data.data
            })
        }, err => {
            alert(err.message)
        })
    }

    updateDateTime(){
        this.setState({
            dateTimeCurrent: new Date()
        })
    }

    formatDate(date) {
        const dia = date.getDate();
        const mes = date.getMonth() + 1;
        const anio = date.getFullYear().toString().slice(2); // Obtener solo los últimos dos dígitos

        return `${dia}/${mes}/${anio}`;
    }

    formatHour(date) {
        const horas = date.getHours();
        const minutos = date.getMinutes().toString();
        const exatmin = minutos.length < 2 ? '0'+minutos : minutos;
        const ampm = horas >= 12 ? 'PM' : 'AM';
        const horas12 = horas % 12 || 12;

        return `${horas12}:${exatmin} ${ampm}`;
    }

    sendCoordinate (date, hour, name, group) {
        const {location, error} =  this.state;
        Socket.emit('coordinate', {
            latitude: location.latitude,
            longitude: location.longitude,
            date: date,
            hour: hour,
            name: name,
            group: group
        })
    }

    activeAlarm(){
        const {name, phone, nameGroup, idAdminGroup, idUser} = this.state.dataUser
        const {dateTimeCurrent} = this.state;
        const dateFormatted = this.formatDate(dateTimeCurrent);
        const hourFormatted =  this.formatHour(dateTimeCurrent)

        if (!name || !phone || !nameGroup || !idAdminGroup || !idUser){
            alert('No es posible activar la alarma, ya que el administrador no a sido asignado a ningun Grupo')
            return
        }

        let information = {
            name: name,
            nameGroup: nameGroup,
            phone:phone ,
            idAdminGroup: idAdminGroup,
            dateActivate: dateFormatted,
            hourActivate: hourFormatted,
            idUser: idUser
        }

        InvokeBackend.activeAlarm(`/alarm/activate`, information, data => {
            this.sendCoordinate(dateFormatted, hourFormatted, name, nameGroup)
            this.setState({
                messageModal: data.message
            })
            this.toggleModalMessage()
        },
            error => {
            alert(error.message)
        })
    }

    deactivateAlarm(){
        let information = {
            idAdminGroup: this.state.dataUser.idAdminGroup,
        }
        InvokeBackend.activeAlarm(`/alarm/deactivate`, information, data => {
            this.setState({
                messageModal: data.message
            })
            this.toggleModalMessage()
        },
            error => {
            alert(error.message)
            })
    }

    toggleModalMessage(){
        this.setState({
            modalMessage: !this.state.modalMessage
        })
    }

    render() {
        const {modalMessage, messageModal} = this.state
        return(

            <div>
                <div className="row justify-content-center" style={{marginTop:"100px",margin:"4%",padding:"12%",background:"#0076F4"}}>

                    <div className="container  d-flex justify-content-center" >
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button onClick={this.activeAlarm.bind(this)} className="btn btn-light" type="button" style={{ backgroundColor: "#FFFFFF", borderRadius: "30px", margin: '40px' }}>
                                <img src={activate} width="120" height="120" alt="Activate" />
                            </button>
                            <button onClick={this.deactivateAlarm.bind(this)} className="btn btn-danger" type="button" style={{ backgroundColor: "#E04F5F", borderRadius: "30px", margin: '40px' }}>
                                <img src={alarma} width="120" height="120" alt="Alarm" />
                            </button>
                        </div>
                    </div>
                    {/*<button className='btn btn-secondary' onClick={()=>{console.log(this.state.dataUser)}}>datos de Usuario</button>*/}
                </div>

                {/*<button className='btn btn-primary' onClick={()=>{this.getubication()}}>obtener ubicacion</button>*/}

                <Modal isOpen={modalMessage}>
                    <ModalHeader>
                        Mensaje
                    </ModalHeader>
                    <ModalBody>
                        {messageModal}
                    </ModalBody>
                    <ModalBody>
                        <button className='btn btn-secondary' onClick={()=>{this.toggleModalMessage()}}>Cerrar</button>
                    </ModalBody>
                </Modal>
            </div>

        )
    }
}

export default card;
