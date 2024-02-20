import React from "react";
import "../assets/stylesheets/cardHome.css";
import alarma from "../assets/img/alarma.png";
import activate from "../assets/img/activate.png";
import bd from "../utils/invokeBackend";
import {decryptData} from "../utils/encriptData";
import Socket from "./Socket";
import {secretKey} from "../../configServer";
import InvokeBackend from "../utils/invokeBackend";

class card extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            location: null,
            error: null,
            dateTimeCurrent: new Date(),
            dataUser: []
        }
    }
    async componentDidMount() {

        await this.getDataUser()
        // Verificar si el navegador soporta la geolocalización
        if (navigator.geolocation) {
            // Obtener la ubicación actual
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.setState({ location: { latitude, longitude } });
                },
                (error) => {
                    alert.error("Error obteniendo la ubicación:", error);
                }
            );
        } else {
            alert.error("La geolocalización no está soportada por este navegador.");
        }

        this.intervalID = setInterval(
            () => this.updatedatetime(),
            1000
        )

        Socket.on('connect', () => {
            // console.log("Cliente Conectado ", Socket.id)
        })

        console.log('Datos de Usuario: ', this.state.dataUser)
    }

    componentWillUnmount() {
        //Limpiar el intervalo cuando el componente se desmonta
        clearInterval(this.intervalID)
    }

    async getDataUser(){
        const token = {
            token: await decryptData(localStorage.getItem('token').split(',').map(Number), secretKey, localStorage.getItem('ivT').split(',').map(Number))
        }
        await InvokeBackend.posInvocation(`/token/getDataUser`, token, data => {
            this.setState({
                dataUser: data.data
            })
            console.log(data.message)
        }, err => {
            alert(err.message)
        })
    }

    updatedatetime(){
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



    async activeAlarm(){
        const {dateTimecurrent} = this.state;
        const dateFormatted = this.formatDate(dateTimecurrent);
        const hourFormatted =  this.formatHour(dateTimecurrent)
        const name = this.state.dataUser.name
        const phone = this.state.dataUser.phone
        const idGroup = this.state.dataUser.nameGroup

        let information = {
            name: name,
            idGroup: idGroup,
            phone:phone ,
            dateActivate: dateFormatted,
            hourActivate: hourFormatted,
        }
        // console.log(localStorage.getItem("idGroup"))
        // console.log(information)

        bd.activeAlarm(`/alarm/activate`, information, data => {
            // console.log(data.group[0])
            this.sendCoordinate(dateFormatted, hourFormatted, name, data.group[0])
            alert(data.message)
        },
            error => {
            alert(error.message)
            })
    }

    deactivateAlarm(){
        let information = {
            idGroup: localStorage.getItem("idGroup"),
        }
        bd.activeAlarm(`/alarm/deactivate`, information, data => {
            console.log(data)
            alert(data.message)
        },
            error => {
            alert(error.message)
            })
    }

    render() {
        return(

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
            </div>


        )
    }
}

export default card;
