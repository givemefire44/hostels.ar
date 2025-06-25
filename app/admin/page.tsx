"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";

const PASSWORD = "admin123"; // Cambia esta contraseña si lo deseas

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

  // Editor Tiptap con barra de herramientas
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Link,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
    ],
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

  // Barra de herramientas para el editor
  function Toolbar() {
    if (!editor) return null;
    return (
      <div style={{
        border: "1px solid #ddd",
        borderRadius: 4,
        marginBottom: 8,
        padding: 6,
        background: "#fafafa",
        display: "flex",
        gap: 6,
        flexWrap: "wrap"
      }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={{ fontWeight: editor.isActive('bold') ? "bold" : "normal" }}>
          B
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={{ fontStyle: editor.isActive('italic') ? "italic" : "normal" }}>
          I
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} style={{ textDecoration: editor.isActive('underline') ? "underline" : "none" }}>
          U
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={{ fontWeight: editor.isActive('heading', { level: 1 }) ? "bold" : "normal" }}>
          H1
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={{ fontWeight: editor.isActive('heading', { level: 2 }) ? "bold" : "normal" }}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={{ fontWeight: editor.isActive('heading', { level: 3 }) ? "bold" : "normal" }}>
          H3
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={{ fontWeight: editor.isActive('bulletList') ? "bold" : "normal" }}>
          • Lista
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={{ fontWeight: editor.isActive('orderedList') ? "bold" : "normal" }}>
          1. Lista
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={{ fontWeight: editor.isActive('blockquote') ? "bold" : "normal" }}>
          “Cita”
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={{ fontWeight: editor.isActive('codeBlock') ? "bold" : "normal" }}>
          {'</>'}
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Pega la URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          style={{ fontWeight: editor.isActive('link') ? "bold" : "normal" }}
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
        >
          ❌🔗
        </button>
      </div>
    );
  }

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
          <Toolbar />
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              minHeight: 180,
              padding: 8,
              marginTop: 4,
              background: "#fff",
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
