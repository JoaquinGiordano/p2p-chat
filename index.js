let peer = new Peer()
let connection

peer.on('open', (id) => {
    document.querySelector('#id_container').innerHTML += id
})

peer.on('connection', (conn) => {
    writeOnChat('An user has entered to your chat')
    if (!connection) {
        connection = conn
    }
    connection.on('data', (data) => {
        writeOnChat(data.message, data.user)
    })
})

const writeOnChat = (text, user) => {
    let chat_container = document.querySelector('#chat_container')
    if (user) {
        chat_container.innerHTML += `<b>${user}</b>: <span>${text}</span><br/>`
    } else {
        chat_container.innerHTML += `<b>${text}</b><br/>`
    }
}

const createConnection = () => {
    connection = peer.connect(document.querySelector('#dest_container').value)
    connection.on('data', (data) => {
        writeOnChat(data.message, data.user)
    })
}

const sendMessage = () => {
    let userName = document.querySelector('#name_container').value
    let message = document.querySelector('#message').value
    if (connection) {
        writeOnChat(message, userName)
        connection.send({ user: userName, message: message })
    } else {
        writeOnChat('Please create a connection')
    }
}
