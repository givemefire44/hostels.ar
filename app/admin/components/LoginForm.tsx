import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Recibe la función onAuth como prop
export default function LoginForm({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setError('');
      // Llama al padre: habilita el panel admin
      onAuth();
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ fontSize: 16, padding: 8, display: "block", width: "100%", marginBottom: 12 }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={{ fontSize: 16, padding: 8, display: "block", width: "100%", marginBottom: 12 }}
      />
      <button type="submit" style={{ fontSize: 16, padding: "10px 20px", width: "100%" }}>Ingresar</button>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
    </form>
  );
}
