const axios = require('axios')

const pristupniToken = "CLIENT_ACCESS_TOKEN"


//salje POST requestove ka dialogFlow servisu 
module.exports = {
    send(message){
        const data = {
            query: message,
            lang: 'en',
            sessionId: '123456asd'
        }
        
        return axios.post( data , {
            headers: {
                Authorization: `Bearer ${pristupniToken}`
            }
        })    
    }
}