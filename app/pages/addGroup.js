import React from "react";
import db from "../utils/invokeBackend"


class addGroup extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            numAlarm: ''
        };
    }
    handleChange(e) {
        const fieldName = e.target.name;
        const value = e.target.value;

        this.setState({
            [fieldName]: value
        });
    }
    handleSubmit(e) {
        e.preventDefault();

        if (this.state.name !== '' && this.state.numAlarm !== ''){

            let group = {
                name: this.state.name,
                numAlarm: this.state.numAlarm
            }

            db.posInvocation(`/group/addGroup`, group, data => {
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
        }
    }
    goBack(){
        this.props.history.push('/Alta')
    }

    render() {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="col-md-4">
                    <h1 className="text-center mb-4">Agregar Grupo</h1>
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
                            />
                        </div>
                        <div className="text-center">
                            <button type='submit' className="btn btn-primary">Agregar Grupo</button>
                        </div>
                    </form>
                    <br/>
                    <div className="text-center">
                        <button onClick={this.goBack.bind(this)} className="btn btn-primary">Regresar</button>
                    </div>
                </div>
            </div>
        );
    }


}


export default addGroup


