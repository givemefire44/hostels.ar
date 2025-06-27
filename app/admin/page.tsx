"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EditorContent, useEditor, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from "@tiptap/react";
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
import Image from "@tiptap/extension-image";
import Gallery from './extensions/Gallery';
import LoginForm from './components/LoginForm';

// --- NodeView personalizado para controles sobre imágenes ---
const ImageWithControls = (props: any) => {
  const { node, updateAttributes, deleteNode } = props;

  // Solo muestra controles si la imagen está seleccionada
  return (
    <NodeViewWrapper style={{ position: "relative", display: "inline-block" }}>
      <img
        src={node.attrs.src}
        alt=""
        style={{
          maxWidth: 400,
          maxHeight: 300,
          borderRadius: 8,
          display: "block",
          margin: "16px auto"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 4,
          background: "rgba(0,0,0,0.6)",
          borderRadius: 4,
          padding: "2px 4px",
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Nueva URL de la imagen", node.attrs.src);
            if (url) updateAttributes({ src: url });
          }}
          style={{
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
          title="Reemplazar imagen"
        >
          🔄
        </button>
        <button
          type="button"
          onClick={deleteNode}
          style={{
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
          title="Eliminar imagen"
        >
          🗑️
        </button>
      </div>
      <NodeViewContent />
    </NodeViewWrapper>
  );
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NuevaEntradaPage() {
  // Controla si el usuario está autenticado (vía LoginForm)
  const [auth, setAuth] = useState(false);

  // Formulario de post
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [imagen, setImagen] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Para editar posts existentes
  const [editandoId, setEditandoId] = useState<number|null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Lista de posts
  const [posts, setPosts] = useState<any[]>([]);
  const [cargandoPosts, setCargandoPosts] = useState(false);

  // Editor Tiptap con NodeView de imagenes personalizado
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
      // Aquí extendemos la extensión Image
      Image.extend({
        addNodeView() {
          return ReactNodeViewRenderer(ImageWithControls);
        }
      }),
    ],
    content: "",
  });

  // Cargar posts al entrar
  useEffect(() => {
    if (auth) cargarPosts();
    // eslint-disable-next-line
  }, [auth]);

  const cargarPosts = async () => {
    setCargandoPosts(true);
    const { data, error } = await supabase.from("posts").select("*").order("id", { ascending: false });
    if (!error) setPosts(data || []);
    setCargandoPosts(false);
  };

  // Guardar (crear o editar) post
  const guardarEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");

    if (!titulo || !slug || !editor?.getHTML()) {
      setMensaje("Por favor, completa todos los campos.");
      setGuardando(false);
      return;
    }

    if (editandoId) {
      const { error } = await supabase
        .from("posts")
        .update({
          titulo,
          contenido: editor.getHTML(),
          slug,
          imagen,
          metaDesc,
        })
        .eq('id', editandoId);

      if (error) {
        setMensaje("Error al editar: " + error.message);
      } else {
        setMensaje("¡Entrada actualizada!");
        limpiarFormulario();
        cargarPosts();
      }
    } else {
      const { error } = await supabase.from("posts").insert([
        {
          titulo,
          contenido: editor.getHTML(),
          slug,
          imagen,
          metaDesc,
        },
      ]);

      if (error) {
        setMensaje("Error al guardar: " + error.message);
      } else {
        setMensaje("¡Entrada guardada!");
        limpiarFormulario();
        cargarPosts();
      }
    }
    setGuardando(false);
    setShowPreview(false);
  };

  const limpiarFormulario = () => {
    setTitulo("");
    setSlug("");
    setImagen("");
    setMetaDesc("");
    setEditandoId(null);
    editor?.commands.setContent("");
  };

  const borrarPost = async (id: number) => {
    if (!window.confirm("¿Seguro que quieres borrar esta entrada?")) return;
    await supabase.from("posts").delete().eq("id", id);
    cargarPosts();
  };

  const editarPost = (post: any) => {
    setTitulo(post.titulo);
    setSlug(post.slug);
    setImagen(post.imagen || "");
    setMetaDesc(post.metaDesc || "");
    setEditandoId(post.id);
    editor?.commands.setContent(post.contenido || "");
    window.scrollTo({top: 0, behavior: "smooth"});
    setShowPreview(false);
  };

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
        <button
          type="button"
          onClick={() => {
            const url = prompt("Pegá la URL de la imagen");
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >
          🖼️ Imagen
        </button>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="upload-image"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const filePath = `blog/${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
              .from("blog-images")
              .upload(filePath, file);
            if (error) {
              alert("Error al subir la imagen: " + error.message);
              return;
            }
            const { data: urlData } = supabase.storage
              .from("blog-images")
              .getPublicUrl(filePath);
            if (urlData?.publicUrl) {
              editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
            } else {
              alert("No se pudo obtener la URL pública.");
            }
          }}
        />
        <label htmlFor="upload-image" style={{ cursor: "pointer", padding: "4px 8px", border: "1px solid #ccc", borderRadius: 4, marginLeft: 4 }}>
          ⬆️ Subir imagen
        </label>
      </div>
    );
  }

  // SEO Preview Snippet
  function SeoSnippet() {
    const url = `https://tusitio.com/posts/${slug}`;
    return (
      <div style={{
        background: "#fff",
        border: "1px solid #e1e1e1",
        borderRadius: 6,
        margin: "24px 0 0 0",
        padding: 18,
        maxWidth: 540,
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{ color: "#202124", fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>{titulo || "Título del post"}</div>
        <div style={{ color: "#006621", fontSize: 13, marginBottom: 2 }}>{url}</div>
        <div style={{ color: "#545454", fontSize: 13, lineHeight: 1.5 }}>{metaDesc || "Aquí tu meta descripción aparecerá como en Google."}</div>
      </div>
    );
  }

  // Muestra el login si no está autenticado (usa el componente LoginForm)
  if (!auth) {
    return (
      <main style={{ padding: 32, maxWidth: 420, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: 24, color: "#333" }}>Panel de Administración</h2>
        <LoginForm onAuth={() => setAuth(true)} />
      </main>
    );
  }

  // Panel principal si está autenticado
  return (
    <main style={{ padding: 32, maxWidth: 860, margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 32, color: "#222" }}>Panel de Administración</h1>
      <form onSubmit={guardarEntrada} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => {
            setTitulo(e.target.value);
            setSlug(slugify(e.target.value));
          }}
          required
          style={{ fontSize: 18, padding: 10 }}
        />
        <input
          type="text"
          placeholder="Slug (url única)"
          value={slug}
          onChange={e => setSlug(slugify(e.target.value))}
          style={{ fontSize: 16, padding: 10 }}
        />
        <input
          type="text"
          placeholder="Imagen (URL)"
          value={imagen}
          onChange={e => setImagen(e.target.value)}
          style={{ fontSize: 16, padding: 10 }}
        />
        <textarea
          placeholder="Meta descripción para SEO"
          value={metaDesc}
          onChange={e => setMetaDesc(e.target.value)}
          maxLength={160}
          rows={2}
          style={{resize:'vertical', fontSize: 16, padding: 10, minHeight: 48, background: "#fff", color: "#222" }}
        />
        <div>
          <label style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#222" }}>Contenido:</label>
          <Toolbar />
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              minHeight: 180,
              padding: 8,
              marginTop: 4,
              background: "#fff",
              position: "relative"
            }}
          >
            <EditorContent editor={editor} />
            <style>{`
              .ProseMirror img {
                max-width: 400px;
                max-height: 300px;
                height: auto;
                width: auto;
                display: block;
                margin: 16px auto;
                border-radius: 8px;
              }
            `}</style>
          </div>
        </div>
        <div style={{display:'flex', gap:16}}>
          <button type="submit" disabled={guardando} style={{ fontSize: 16, padding: "10px 20px" }}>
            {guardando ? (editandoId ? "Actualizando..." : "Guardando...") : (editandoId ? "Actualizar entrada" : "Guardar entrada")}
          </button>
          <button
            type="button"
            style={{background:'#e1e1e1', fontSize: 16, padding: "10px 20px"}}
            onClick={() => setShowPreview(p => !p)}
          >
            {showPreview ? "Ocultar Previa" : "Vista Previa"}
          </button>
        </div>
        {mensaje && <div style={{ color: mensaje.startsWith("¡") ? "green" : "red" }}>{mensaje}</div>}
        {editandoId && (
          <button type="button" onClick={limpiarFormulario} style={{ background: "#eee", fontSize: 16, padding: "10px 20px" }}>
            Cancelar edición
          </button>
        )}
      </form>

      {/* SEO snippet y preview */}
      {showPreview && (
        <div style={{marginTop:24}}>
          <h3 style={{marginBottom:12, color: "#333" }}>Vista previa de SEO:</h3>
          <SeoSnippet />
          <h3 style={{margin:"32px 0 12px", color: "#333" }}>Vista previa del contenido:</h3>
          <div
            className="preview-content"
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 18,
              background: "#fafafa",
              minHeight: 150
            }}
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "<p>(Sin contenido)</p>" }}
          />
          {imagen && (
            <div style={{marginTop:16}}>
              <img src={imagen} alt="Vista previa" style={{maxWidth: 340, maxHeight: 180, borderRadius: 6}} />
            </div>
          )}
        </div>
      )}

      <hr style={{ margin: "36px 0" }} />

      <h2 style={{ marginBottom: 16, color: "#222" }}>Entradas existentes</h2>
      {cargandoPosts ? (
        <p>Cargando...</p>
      ) : posts.length === 0 ? (
        <p>No hay entradas.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{border: "1px solid #ccc", padding: 8}}>Título</th>
              <th style={{border: "1px solid #ccc", padding: 8}}>Slug</th>
              <th style={{border: "1px solid #ccc", padding: 8}}>Imagen</th>
              <th style={{border: "1px solid #ccc", padding: 8}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td style={{border: "1px solid #ccc", padding: 8}}>{post.titulo}</td>
                <td style={{border: "1px solid #ccc", padding: 8}}>{post.slug}</td>
                <td style={{border: "1px solid #ccc", padding: 8, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis"}}>
                  {post.imagen ? <img src={post.imagen} alt="" style={{maxWidth: 80, maxHeight: 40}}/> : "-"}
                </td>
                <td style={{border: "1px solid #ccc", padding: 8}}>
                  <button onClick={() => editarPost(post)} style={{marginRight: 8}}>Editar</button>
                  <button onClick={() => borrarPost(post.id)} style={{color: "red"}}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
