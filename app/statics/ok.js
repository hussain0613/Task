class Session{
    constructor(ws){
        this.ws = ws;
    }

    sendMessage(event) {
        var input = document.getElementById("messageText")
        ws.send(input.value)
        input.value = ''
        event.preventDefault()
    }
}



function login() {
    ws = new WebSocket(location.origin.replace(location.protocol, "ws:")+"/ws?uname="+ document.getElementById('uname').value);
    document.getElementById('authbox').style.display='none'
    document.getElementById('logout_btn').style.display='block'
    document.getElementById('chatbox').style.display='block'


    ws.onmessage = function(event) {
        var messages = document.getElementById('messages')
        var message = document.createElement('li')
        var content = document.createTextNode(event.data)
        message.appendChild(content)
        messages.appendChild(message)
    };

    ws.onclose = function name(event) {
        var messages = document.getElementById('messages')
        var message = document.createElement('li')
        var content = document.createTextNode("[*] server disconnected")
        message.appendChild(content)
        messages.appendChild(message)
    }
    session = new Session(ws);
    //event.preventDefault()
    return session;
}

function logout() {
    ws.close()
    document.getElementById('authbox').style.display='block'
    document.getElementById('logout_btn').style.display='none'
    document.getElementById('chatbox').style.display='none'
    //event.preventDefault()
    return false;
}
