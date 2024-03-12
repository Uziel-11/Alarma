const configuration = require('../../configServer');
const debug = configuration.debugmode;

class invokeBackEnd {

    getHeader(){
        return({
            'Content-Type' : "application/json"
        })
    }

    getInvocation(url, ok, fail){
        let params = {
            method: 'GET',
            headers: this.getHeader()
        }

        this.invocation(url, ok, fail, params)
    }

    deleteInvocation(url, ok, fail){
        let params = {
            method: 'DELETE',
            headers: this.getHeader()
        }

        this.invocation(url, ok, fail, params)
    }

    posInvocation(url,body, ok, fail){
        let params = {
            method: 'POST',
            headers: this.getHeader(),
            body: JSON.stringify(body)
        }

        this.invocation(url, ok, fail, params)
    }

    activeAlarm(url, body, ok, fail){
        let params = {
            method: "POST",
            headers: this.getHeader(),
            body: JSON.stringify(body)
        }
        this.invocation(url, ok, fail, params)
    }

    invocation(url, ok, fail, params){
        fetch(`${configuration.api.host}${url}`, params)
            .then(response => {
                // console.log("Respuesta: " + JSON.stringify(response))
                if (debug){
                    // console.log("Respuesta de la Solicitud: " + response)
                }

                return response.json()
            })
            .then(data => {

                if (data.status){
                    ok(data)
                }else {
                    fail(data)
                }
            })
            .catch(error => {
                console.log("Se obtuvo un Error: " + error)
            }
        )
    }

}

export default new invokeBackEnd();
