import React, { Component } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import Socket from "../components/Socket";
import markerIcon from '../assets/img/markin.png'
import Header from "../components/Header";
import Report from "./Report";

class MapComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: 16.7568467, // Valor inicial de latitud
            longitude: -93.1010638, // Valor inicial de longitud
        };

        this.handleSocketData = this.handleSocketData.bind(this);
    }
    componentDidMount() {
        const {latitude, longitude} = this.state
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    })
                })
            ],
            view: new View({
                center: fromLonLat([longitude, latitude]), // Utilizamos fromLonLat para convertir de longitud/latitud a coordenadas del mapa
                zoom: 16
            })
        });

        // Creamos un marcador
        const markerElement = document.createElement('img');
        markerElement.src = markerIcon;
        markerElement.width = 30;
        markerElement.height = 30;
        // markerElement.className = 'marker';
        const marker = new Overlay({
            id: 'markerOverlay',
            element: markerElement,
            position: fromLonLat([longitude, latitude]), // Coordenadas del marcador
            positioning: 'center-center',
            offset: [0, -20], // Ajusta el offset según la apariencia del marcador
            stopEvent: false
        });

        map.addOverlay(marker);
        this.map = map
        Socket.on('updateLocation', this.handleSocketData)
    }

    componentWillUnmount() {
        Socket.off('updateLocation', this.handleSocketData)
    }

    handleSocketData(data){
        const {latitude, longitude, date, hour, name, group} = data;
        this.setState({latitude, longitude})

        const marker = this.map.getOverlayById('markerOverlay');
        marker.setPosition(fromLonLat([longitude, latitude]))
        this.map.getView().setCenter(fromLonLat([longitude, latitude]))
        alert(name + ' a activo la alarma del grupo: '+group+ ';\nFecha: '+date+'\nHora: '+hour)
    }

    render() {
        return (
            <div>
                <Header/>
                <br/>
                <div className="container-fluid">
                    <div className="row">
                        <div id="map" style={{ width: '100%', height: '462.5px', marginBottom: '20px' }}></div>
                        {/*<div className="col-md-6 order-md-1 order-1">*/}
                        {/*    */}
                        {/*</div>*/}
                        {/*<div className="col-md-6 order-md-2 order-2">*/}
                        {/*    <div style={{marginRight: '5%'}}>*/}
                        {/*        <Report/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>

            </div>
        )
    }
}

export default MapComponent;
