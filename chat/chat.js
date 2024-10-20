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

  messages.forEach(({ user, message, created_at }) => {
    const messageElement = document.createElement('div');
    messageElement.id = 'DATA';
    messageElement.innerHTML = `
      <p>${user}<span class="puntos">:</span><span class="signo">$</span> </p>
      <h3>${message}</h3>
    `;

    chatBox.appendChild(messageElement);
  });

  chatBox.scrollTop = chatBox.scrollHeight; // Mover al final
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
