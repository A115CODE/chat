// Configura la conexión a DB
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wlqtxjuogwxhwczvrudw.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndscXR4anVvZ3d4aHdjenZydWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzODI5MDEsImV4cCI6MjA0NDk1ODkwMX0.7jyFURnO75i6c7KMF0nkkruBvt5_Z5nm15jtImsb6BA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Verificar la sesión del usuario en chat.html
async function checkUserSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'index.html';
  } else {
    loadMessages();
  }
}

// Ejecutar la verificación cuando se cargue chat.html
checkUserSession();

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const messageForm = document.getElementById('message-form');
const logoutButton = document.getElementById('logout_button');

// Función para enviar mensajes
async function sendMessage(event) {
  event.preventDefault(); // Evitar recarga del formulario

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    alert('Por favor, inicia sesión para enviar mensajes.');
    return;
  }

  const message = messageInput.value.trim();
  const user = session.user.email;

  if (message === '') {
    alert('Por favor ingresa un mensaje.');
    return;
  }

  const { error } = await supabase
    .from('messages')
    .insert([{ user, message }]);

  if (error) {
    console.error('Error al enviar el mensaje:', error);
  } else {
    messageInput.value = ''; // Limpiar el input de mensaje
    loadMessages(); // Cargar mensajes actualizados
  }
}

// Escuchar el evento 'submit' del formulario para enviar el mensaje
messageForm.addEventListener('submit', sendMessage);

// Escuchar cuando se presione la tecla "Enter" en el textarea
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) { // Detecta la tecla Enter
    event.preventDefault(); // Evita salto de línea
    messageForm.dispatchEvent(new Event('submit')); // Dispara el evento submit
  }
});

// Función para cargar mensajes
async function loadMessages() {
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error al cargar los mensajes:', error);
    return;
  }

  chatBox.innerHTML = ''; // Limpiar el chat antes de actualizar

  messages.forEach(({ user, message }) => {
    const messageElement = document.createElement('div');
    messageElement.id = 'DATA';

    messageElement.addEventListener('click', () => {
      copyToClipboard(message); // Copiar el contenido del mensaje
    });

    messageElement.innerHTML = `
      <p>${user}<span class="puntos">:</span> <span class="signo">$</span></p>
      <h3>${message}</h3>
    `;

    chatBox.appendChild(messageElement);
  });

  chatBox.scrollTop = chatBox.scrollHeight; // Mover al final
}

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;

  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);

  console.log('Mensaje copiado al portapapeles');
}

// Cerrar sesión
logoutButton.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error al cerrar sesión:', error.message);
  } else {
    window.location.href = '../index.html'; // Redirigir al login
  }
});
