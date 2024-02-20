import React from 'react';
import Header from "../components/Header";
import bd from '../utils/invokeBackend'



class highUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            newContact: {
                name: '',
                password:'',
                phone: '',
                group: '',
            },
            deleteUser: '',
            zones: [],
            selectedValue: '',
            selectedValueGroup: '',
        };
    }

    componentDidMount() {
        const getGroupsPromise = new Promise((resolve, reject) => {
            bd.getInvocation(`/group/getGroups`,
                data => {
                    // console.log(data)
                    resolve(data);
                },
                error => {
                    reject(error);
                }
            );
        });

        const getUsersPromise = new Promise((resolve, reject) => {
            bd.getInvocation(`/users/getUsers`,
                data => {
                    resolve(data);
                },
                error => {
                    reject(error);
                }
            );
        });

        Promise.all([getGroupsPromise, getUsersPromise])
            .then(([groupsData, usersData]) => {
                // console.log('no se que paso ', groupsData.data)
                // const groupZones = groupsData.map(item => item.idZones);

                this.setState({
                    zones: groupsData.data,
                    contacts: usersData.data,
                });

            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
    }


    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            newContact: {
                ...prevState.newContact,
                [name]: value,
            },
        }));
    };

    handleChangeForDeleteUser = (event) => {
        const { name, value } = event.target;
        this.setState({
            deleteUser: value,
        });
    };


    handleSelectChange = (name, event) => {
        this.setState({ [name]: event.target.value });
    };

    handleAddContact = () => {
        const { newContact, contacts } = this.state;
        newContact.group = this.state.selectedValueGroup
        const idzones = this.state.zones.find(item => item.name === this.state.selectedValueGroup).idGroup
        if (newContact.name && newContact.password && newContact.phone && idzones) {
            let user = {
                name: newContact.name,
                password: newContact.password,
                phone: newContact.phone,
                idGroup: idzones
            }

            bd.posInvocation(`/users/saveUser`, user, data => {
                // console.log(data)
                    this.setState({
                        contacts: [...contacts, newContact],
                        newContact: {
                            name: '',
                            password: '',
                            phone: '',
                            group: '',
                        },
                        selectedValue: '',
                        selectedValueGroup: '',
                    });
            },
                error => {
                console.error(error.message)
            })
        }
    };

    addGroup () {
        this.props.history.push('/Grupo')
    }

    addAdmin(){
        this.props.history.push('/HighAdmin')
    }

    deletedUser = () => {
        bd.deleteInvocation(`/users/deleteUser/${this.state.deleteUser}`,
            data => {
            console.log(data)
            },
            error => {
            console.log(error)
            })
    };

    goBack (){
        this.props.history.push("/Home")
    }


    render() {
        const { zones, selectedValue, selectedValueGroup } = this.state;
        const { contacts, newContact } = this.state;

        return (
            <>
                <Header/>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                        className="btn btn-primary ms-2"
                        onClick={this.goBack.bind(this)}
                        style={{ marginRight: 'auto' }}
                    >
                        Volver
                    </button>

                    <button
                        className="btn btn-primary me-2"
                        onClick={this.addAdmin.bind(this)}
                        // onClick={this.altaAdministrador.bind(this)}
                        style={{ marginLeft: 'auto' }}
                    >
                        Alta Administrador
                    </button>
                </div>

                <div className="mb-2"></div>

                <div className="col-md-6">
                    <div className="row">
                        <div className="col-6 ms-2">
                            <input
                                type="text"
                                className="form-control mb-2"
                                name="phoneNumber"
                                placeholder="Agrega Numero de Telefono"
                                value={this.state.deleteUser}
                                onChange={this.handleChangeForDeleteUser}
                            />
                        </div>
                        <div className="col-6 ms-5">
                            <button
                                className="btn btn-secondary"
                                onClick={this.deletedUser}
                                disabled={this.state.deleteUser.length < 10}
                            >
                                Eliminar Usuario
                            </button>
                        </div>
                    </div>

                </div>


                <div className="container mx-auto col-md-7 mt-5">
                    <div className='card'>
                        <div className='card-header text-center'> <h4> Agregar un nuevo Cliente </h4> </div>
                        <div className='card-body'>
                            <div className="d-flex justify-content-center">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        name="name"
                                        placeholder="Nombre Completo"
                                        value={newContact.name}
                                        onChange={this.handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        name="phone"
                                        placeholder="Número de Teléfono"
                                        value={newContact.phone}
                                        onChange={this.handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        name="password"
                                        placeholder="Contraseña"
                                        value={newContact.password}
                                        onChange={this.handleInputChange}
                                    />
                                    <select
                                        className="form-select-mg"
                                        value={selectedValueGroup}
                                        onChange={(event) => this.handleSelectChange('selectedValueGroup', event)}
                                    >
                                        <option value={newContact.group}>Seleccione un Grupo</option>
                                        {zones.map((item) => (
                                            <option key={item.idGroup} value={item.Group}>
                                                {item.nameGroup}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="text-center mt-3">
                                        <button
                                            className="btn btn-primary"
                                            onClick={this.handleAddContact}
                                            disabled={!newContact.name || !newContact.password || !newContact.phone || !selectedValueGroup}
                                        >
                                            Agregar Contacto
                                        </button>
                                    </div>

                                    <div className="text-center mt-3">
                                        <button
                                            className="btn btn-primary"
                                            onClick={this.addGroup.bind(this)}
                                        >
                                            Agregar Nuevo Grupo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <br/>
                <div className=" text-center mt-4">
                    <h1 className="text-center"> Clasificacion por Grupos </h1>
                    <select
                        className="form-select-mg"
                        value={selectedValue}
                        onChange={(event) => this.handleSelectChange('selectedValue', event)}
                    >
                        <option value="">Todos</option>
                        {zones.map((item) => (
                            <option key={item.idGroup} value={item.Group}>
                                {item.nameGroup}
                            </option>
                        ))}
                    </select>
                    <button onClick={this.filtrar}> filtrar </button>
                    <br/>
                    <form >
                        {contacts.map((contact, index) => (
                            <li key={index}>
                                <strong>Nombre:</strong> {contact.name},{' '}
                                <strong>Teléfono:</strong> {contact.phone},{' '}
                                <strong>Grupo:</strong> {contact.group}
                            </li>
                        ))}
                    </form>
                </div>

            </>
        );
    }


    filtrar = () =>{

        let option = {
            selectedValue: ''
        }

        if (this.state.selectedValue !== '') {

            const selectedItem = this.state.zones.find(item => item.nameGroup === this.state.selectedValue);
            if (selectedItem) {
                option.selectedValue = selectedItem.idGroup
            }


            // console.log(this.state.selectedValue)
            bd.posInvocation(`/users/filter`, option,
                data => {
                // console.log(data.data)
                    this.setState({
                        contacts: data.data,
                    })
                },
                error => {
                    console.log(error)
                })
        }else {

            bd.getInvocation(`/users/getUsers`,
                data => {
                // console.log(data.data)
                    this.setState({
                        contacts: data.data,
                    })

                },
                error => {
                    console.log(error)
                })
        }
    }
}

export default highUsers;
