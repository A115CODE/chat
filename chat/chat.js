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
    // Si no hay sesión activa, redirigir a la página de login
    window.location.href = 'index.html';
  } else {
    console.log('Sesión activa:', session);
    // Si la sesión está activa, cargar mensajes
    loadMessages();
  }
}

// Ejecutar la verificación cuando se cargue chat.html
checkUserSession();

const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const logoutButton = document.getElementById('logout_button'); // Botón de cerrar sesión

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
  const user = session.user.email; // Usa el correo del usuario autenticado como identificador

  if (message === '') {
    alert('Por favor ingresa un mensaje.');
    return;
  }

  const { error } = await supabase
    .from('messages')
    .insert([{ user: user, message }]);

  if (error) {
    console.error('Error al enviar el mensaje:', error);
  } else {
    messageInput.value = ''; // Limpiar el input de mensaje
    loadMessages(); // Cargar mensajes actualizados
  }
}

// Escuchar el evento submit del formulario
const messageForm = document.getElementById('message-form');
messageForm.addEventListener('submit', sendMessage);

// Función para mostrar mensajes
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

    // Crear el botón para copiar el mensaje
    const copyButton = document.createElement('div');
    copyButton.innerHTML = `
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"/>
      </svg>
    `;
    copyButton.addEventListener('click', () => {
      copyToClipboard(message); // Copiar solo el contenido del mensaje
    });

    messageElement.innerHTML = `
      <p>${user}<span class="puntos">:</span><span class="signo">$</span></p>
      <h3>${message}</h3>
    `;

    // Añadir el botón de copiar al elemento del mensaje
    messageElement.appendChild(copyButton);

    chatBox.appendChild(messageElement);
  });

  chatBox.scrollTop = chatBox.scrollHeight; // Mover al final
}

// Función para copiar texto al portapapeles
function copyToClipboard(text) {
  // Crear un área de texto temporal
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = text;

  // Añadir al DOM para que sea seleccionable
  document.body.appendChild(tempTextArea);

  // Seleccionar el texto y copiar
  tempTextArea.select();
  document.execCommand('copy');

  // Eliminar el área de texto temporal
  document.body.removeChild(tempTextArea);

  console.log('Mensaje copiado al portapapeles');
}


// Cargar mensajes al cargar la página
checkUserSession();

// Función para cerrar sesión
logoutButton.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error al cerrar sesión:', error.message);
  } else {
    alert('Sesión cerrada correctamente');
    window.location.href = '../index.html'; // Redirigir al login
  }
});
