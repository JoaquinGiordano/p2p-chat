let peer = new Peer()
let connection

peer.on('open', (id) => {
    document.querySelector('#id_container').innerHTML += id
})

peer.on('connection', (conn) => {
    document.querySelector('#config_container').style.display = 'none'
    writeOnChat('An user has entered to your chat')
    if (!connection) {
        connection = conn
    }
    connection.on('data', (data) => {
        writeOnChat(data.message, data.user, true)
    })
})

const writeOnChat = (text, user, recived) => {
    let chat_container = document.querySelector('#chat_container')
    if (user) {
        chat_container.innerHTML += `<div class='chat_message'><b class='${
            recived ? 'recived' : 'sent'
        }'>${user}</b>: <span>${text}</span></div>`
    } else {
        chat_container.innerHTML += `<div class='chat_message'><b>${text}</b></div>`
    }
}

const createConnection = () => {
    connection = peer.connect(document.querySelector('#dest_container').value)
    document.querySelector('#config_container').style.display = 'none'
    writeOnChat("You've been connected with an user")
    connection.on('data', (data) => {
        writeOnChat(data.message, data.user, true)
    })
}

const sendMessage = () => {
    let userName = document.querySelector('#name_container')
    let message = document.querySelector('#message')
    if (userName && message) {
        if (connection) {
            writeOnChat(message.value, userName.value, false)
            connection.send({ user: userName.value, message: message.value })
            message.value = ''
        } else {
            alert('Please create a connection')
        }
    } else {
        alert('Please choose an username and write a message before send')
    }
}

document.querySelector('#message').addEventListener('keypress', (key) => {
    if (key.code === 'Enter') {
        sendMessage()
    }
})
