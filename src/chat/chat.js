const { ipcRenderer } = require('electron');

const chatWrapper = document.getElementById('chat-wrapper');
const messageWrapper = document.getElementById('message-wrapper');
const textBox = document.getElementById('textbox');
const messages = document.getElementById('messages');
const textInput = document.getElementById('text-input');

const emojiPicker = document.getElementById('emoji-picker');
emojiPicker.addEventListener('emoji-click', selection => {
    textInput.value += " " + selection.detail.unicode + " ";
});

const emojiButton = document.getElementById('emoji-button');
emojiButton.addEventListener('click', () => {
    emojiPicker.classList.toggle("hidden");
});
emojiButton.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
    }
});

const messageForm = document.getElementById('message-form');
messageForm.addEventListener("submit", processForm);

const SELF_SENDER = 'self';
const REMOTE_SENDER = 'remote';

ipcRenderer.on('ready', (_event, arg) => {
    console.log(_event);
    chatWrapper.classList.toggle("hidden");
    messageWrapper.classList.toggle("hidden");
    textBox.classList.toggle("hidden");
});

ipcRenderer.on('inbound-message', (_event, data) => {
    console.log(data);
    messages.innerHTML += constructMessageHTML(data, REMOTE_SENDER);
});

ipcRenderer.on('sent-message', (_event, data) => {
    console.log("Me: " + data);
    messages.innerHTML += constructMessageHTML(data, SELF_SENDER);
});


function processForm(event) {
    // Parse form and grab text input
    if (event.preventDefault) event.preventDefault();
    var message = $(':input').serializeArray()[0].value;
    // Reset input value to blank
    $(':input').val('');
    if (message != "") {
        ipcRenderer.send('handle-message', message);
    }
}

function constructMessageHTML(message, sender) {
    return `<span class="message ${sender}">${message}</span>`
}
