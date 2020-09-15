let peer = new Peer()
let connections = []

peer.on('open', (id) => {
    document.querySelector('#id_container').innerHTML += id
})

peer.on('connection', (conn) => {
    document.querySelector('#config_container').style.display = 'none'
    writeOnChat('An user has entered to your chat')
    if (connections.length == 0) {
        connections = [conn]
    } else {
        connections = [...connections, conn]
    }

    connections[connections.length - 1].on('data', (data) => {
        console.log(data)
        sendMessage(false, data.user, data.message)
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
    connections = [
        ...connections,
        peer.connect(document.querySelector('#dest_container').value),
    ]
    document.querySelector('#id_container').innerHTML = `Room ID: ${
        document.querySelector('#dest_container').value
    }`
    document.querySelector('#config_container').style.display = 'none'
    writeOnChat("You've been connected with an user")
    connections[connections.length - 1].on('data', (data) => {
        if (data.user != document.querySelector('#name_container').value) {
            writeOnChat(data.message, data.user, true)
        }
    })
}

const sendMessage = (sendYourself, paramUserName, paramMessage) => {
    let userName
    let message

    if (paramUserName && paramMessage) {
        userName = paramUserName
        message = paramMessage
    } else {
        userName = document.querySelector('#name_container').value
        message = document.querySelector('#message').value
    }

    if (userName && message) {
        if (connections.length > 0) {
            if (sendYourself) {
                writeOnChat(message, userName, false)
            }

            connections.forEach((connection) => {
                connection.send({
                    user: userName,
                    message: message,
                })
            })
            document.querySelector('#message').value = ''
        } else {
            alert('Please create a connection')
        }
    } else {
        alert('Please choose an username and write a message before send')
    }
}

document.querySelector('#message').addEventListener('keypress', (key) => {
    if (key.code === 'Enter') {
        sendMessage(true)
    }
})
