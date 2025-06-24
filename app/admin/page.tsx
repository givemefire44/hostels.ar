'use client';

import { useState } from 'react';

const PASSWORD = 'admin123'; // Puedes cambiar la contraseña aquí

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuth(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  if (!auth) {
    return (
      <main style={{ padding: 32, maxWidth: 360 }}>
        <h2>Login Admin</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Contraseña"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
            autoFocus
          />
          <button type="submit" style={{ width: '100%', padding: 8 }}>Entrar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    );
  }

  // Si está autenticado, muestra el admin real
  return (
    <main style={{ padding: 32 }}>
      <h1>Panel de Administración</h1>
      <p>¡Acceso concedido! Aquí irán las herramientas de creación de contenido.</p>
    </main>
  );
}
