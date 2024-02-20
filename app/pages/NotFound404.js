import React from 'react';
import notfound from '../assets/img/notFound.png'

class NotFound404 extends React.Component{
    render() {
        return(
            <div style={{ background: '#202020',display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <img src={notfound} style={{ width: '90%', height: 'auto', maxWidth: '62%' }} />
            </div>

        )
    }
}
export default NotFound404;
