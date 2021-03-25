const { ipcRenderer } = require('electron');
window.$ = window.jQuery = require('jquery');

const chatWrapper = document.getElementById('chat-wrapper');
const messageWrapper = document.getElementById('message-wrapper');
const textBox = document.getElementById('textbox');
const messages = document.getElementById('messages');
const textInput = document.getElementById('text-input');
const header = document.getElementById('head');

const messageForm = document.getElementById('message-form');
messageForm.addEventListener("submit", processForm);

const SELF_SENDER = 'self';
const REMOTE_SENDER = 'remote';

ipcRenderer.on('ready', (_event, arg) => {
    chatWrapper.classList.toggle("hidden");
    messageWrapper.classList.toggle("hidden");
    textBox.classList.toggle("hidden");
    header.classList.toggle("hidden");
});

ipcRenderer.on('inbound-message', (_event, data) => {
    messages.innerHTML += constructMessageHTML(data, REMOTE_SENDER);
});

ipcRenderer.on('sent-message', (_event, data) => {
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



const EMOJIS = [
    '😊',
    '😒',
    '👍️',
    '😍',
    '😂',
    '😭',
    '😔',
    '😩',
    '😏',
    '💕',
    '🙌',
    '😘',
    '😃',
    '😐️',
    '😀',
    '🤣',
    '🤩',
    '🥰',
    '🧑‍🦰',
    '😵‍💫'
];

const emojiBox = document.getElementById('emoji-box');
emojiBox.addEventListener('click', (selection) => {
    const id = Number.parseInt(selection.target.id);
    if (Number.isInteger(id)) {
        textInput.value += " " + EMOJIS[id] + " ";
    }
});

const emojiButton = document.getElementById('emoji-button');
emojiButton.addEventListener('click', () => {
    emojiBox.innerHTML = null;
    for (let i = 0; i < EMOJIS.length; i++) {
        emojiBox.innerHTML += `<button id="${i}" class="emoji m-2">${EMOJIS[i]}</button>`
    }
    emojiBox.classList.toggle("hidden");
});

emojiButton.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
    }
});