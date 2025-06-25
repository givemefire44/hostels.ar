"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const PASSWORD = "admin123"; // Puedes cambiar la contraseña aquí

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // Campos del formulario de post
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [imagen, setImagen] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Editor Tiptap
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  // Lógica de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuth(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  // Lógica para guardar post
  const guardarEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    if (!titulo || !slug || !editor?.getHTML()) {
      setMensaje("Por favor, completa todos los campos.");
      setGuardando(false);
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        titulo,
        contenido: editor.getHTML(),
        slug,
        imagen,
      },
    ]);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
    } else {
      setMensaje("¡Entrada guardada!");
      setTitulo("");
      setSlug("");
      setImagen("");
      editor?.commands.setContent("");
    }
    setGuardando(false);
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

  // Si está autenticado, muestra el panel de creación de posts
  return (
    <main style={{ padding: 32, maxWidth: 700, margin: "0 auto" }}>
      <h1>Panel de Administración</h1>
      <form onSubmit={guardarEntrada} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Slug (url única)"
          value={slug}
          onChange={e => setSlug(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Imagen (URL)"
          value={imagen}
          onChange={e => setImagen(e.target.value)}
        />
        <div>
          <label>Contenido:</label>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              minHeight: 150,
              padding: 8,
              marginTop: 4,
            }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar entrada"}
        </button>
        {mensaje && <div style={{ color: mensaje.startsWith("¡") ? "green" : "red" }}>{mensaje}</div>}
      </form>
    </main>
  );
}
