import axios from "axios"

const baseURL = "http://localhost:8000"


export async function sendUserMessage(userMessage) {
    const result = await axios.post(baseURL + "/send/user_message", userMessage)
    .then(response => {
        return response
    }).catch(error => {
        return error
    })
    return result 
}

export async function sendAIMessage(AIMessage) {
    const result = await axios.post(baseURL + "/send/ai_message", AIMessage)
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

export async function informHost(data) {
    const result = await axios.post(baseURL + "/checkin/inform_host", data)
    .then(response => {
        return response
    }).catch(error => {
        return error
    })
    return result
}