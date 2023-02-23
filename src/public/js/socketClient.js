const socket = io('http://localhost:3000');
const messages = document.getElementById('messages');
const msgForm = document.getElementById('msgForm');
const messages_data = document.getElementById('messages_data')



socket.on('connection')
    // var input = `<span>${message}</span>`
socket.on('message', data => {
    const html_friend = `<div class="mt-2" style="padding: 8px 20px; background-color: var(--content-bg); width: fit-content; border-radius: 10px; display: block; border: 1px solid red;">${data}</div>`
    document.getElementById('messages_data').innerHTML += html_friend
})
const sendMessage = () => {
    const messageInput = document.getElementById('messages')
    const message = messageInput.value
    const html_myself = `<div class="mt-2" style="padding: 8px 20px; background-color: var(--content-bg); width: fit-content; border-radius: 10px; float: right; display: block; border: 1px solid red">${message}</div>`
    document.getElementById('messages_data').innerHTML += html_myself
    socket.emit('message', message)
    messageInput.value = ''
}