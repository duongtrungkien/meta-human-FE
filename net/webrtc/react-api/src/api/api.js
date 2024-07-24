import axios from "axios"

const baseURL = "http://localhost:8000"




export async function sendText(userMessage) {
    const result = await axios.post(baseURL + "/send_text", userMessage)
    .then(response => {
        return response
    }).catch(error => {
        return error
    })
    return result 
}

export async function fetchHostData() {
    const result = await axios.get(baseURL + "/checkin/host_data")
    .then(response => {
        return response
    }).catch(error => {
        return error
    })
    return result
}

export async function informHost() {
    const result = await axios.post(baseURL + "/checkin/inform_host")
    .then(response => {
        return response
    }).catch(error => {
        return error
    })
    return result
}