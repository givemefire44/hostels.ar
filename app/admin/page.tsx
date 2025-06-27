"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LoginForm from './components/LoginForm';
import BlogEditor from './components/BlogEditor';

// Slugify helper
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

// SEO Preview Snippet
function SeoSnippet({ titulo, slug, metaDesc }: { titulo: string; slug: string; metaDesc: string }) {
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

export default function NuevaEntradaPage() {
  // Controla si el usuario está autenticado (vía LoginForm)
  const [auth, setAuth] = useState(false);

  // Formulario de post
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [imagen, setImagen] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [contenido, setContenido] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Para editar posts existentes
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Lista de posts
  const [posts, setPosts] = useState<any[]>([]);
  const [cargandoPosts, setCargandoPosts] = useState(false);

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

    if (!titulo || !slug || !contenido) {
      setMensaje("Por favor, completa todos los campos.");
      setGuardando(false);
      return;
    }

    if (editandoId) {
      const { error } = await supabase
        .from("posts")
        .update({
          titulo,
          contenido,
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
          contenido,
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
    setContenido("");
    setEditandoId(null);
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
    setContenido(post.contenido || "");
    setEditandoId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowPreview(false);
  };

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
          style={{ resize: 'vertical', fontSize: 16, padding: 10, minHeight: 48, background: "#fff", color: "#222" }}
        />
        <div>
          <label style={{ fontWeight: "bold", marginBottom: 4, display: "block", color: "#222" }}>Contenido:</label>
          <BlogEditor value={contenido} onChange={setContenido} />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <button type="submit" disabled={guardando} style={{ fontSize: 16, padding: "10px 20px" }}>
            {guardando ? (editandoId ? "Actualizando..." : "Guardando...") : (editandoId ? "Actualizar entrada" : "Guardar entrada")}
          </button>
          <button
            type="button"
            style={{ background: '#e1e1e1', fontSize: 16, padding: "10px 20px" }}
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
        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12, color: "#333" }}>Vista previa de SEO:</h3>
          <SeoSnippet titulo={titulo} slug={slug} metaDesc={metaDesc} />
          <h3 style={{ margin: "32px 0 12px", color: "#333" }}>Vista previa del contenido:</h3>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 18,
              background: "#fafafa",
              minHeight: 150
            }}
            dangerouslySetInnerHTML={{ __html: contenido || "<p>(Sin contenido)</p>" }}
          />
          {imagen && (
            <div style={{ marginTop: 16 }}>
              <img src={imagen} alt="Vista previa" style={{ maxWidth: 340, maxHeight: 180, borderRadius: 6 }} />
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
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Título</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Slug</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Imagen</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{post.titulo}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{post.slug}</td>
                <td style={{ border: "1px solid #ccc", padding: 8, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {post.imagen ? <img src={post.imagen} alt="" style={{ maxWidth: 80, maxHeight: 40 }} /> : "-"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  <button onClick={() => editarPost(post)} style={{ marginRight: 8 }}>Editar</button>
                  <button onClick={() => borrarPost(post.id)} style={{ color: "red" }}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
