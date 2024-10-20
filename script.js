// Configura la conexión a DB
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://wlqtxjuogwxhwczvrudw.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndscXR4anVvZ3d4aHdjenZydWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzODI5MDEsImV4cCI6MjA0NDk1ODkwMX0.7jyFURnO75i6c7KMF0nkkruBvt5_Z5nm15jtImsb6BA';
const supabase = createClient(supabaseUrl, supabaseKey);

//
const loginButton = document.getElementById('login-button');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Inicio de sesión
loginButton.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { session, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert('Error en el inicio de sesión:', error.message);
  } else {
    alert('Inicio de sesión exitoso');
    // Redirigir al chat después del inicio de sesión
    window.location.href = './chat/chat.html';
  }
});

// Registro de usuario
signUpButton.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert('Error en el registro:', error.message);
  } else {
    alert('Registro exitoso. Verifica tu correo electrónico.');
  }
});
