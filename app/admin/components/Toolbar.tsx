import React, { useState } from "react";

export default function Toolbar({ editor, supabase }: { editor: any, supabase: any }) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);

  if (!editor) return null;

  // Paletas de colores
  const textColors = [
    '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
    '#ff0000', '#ff6600', '#ffcc00', '#00ff00', '#0066ff', '#6600ff',
    '#ff3366', '#ff9900', '#33cc00', '#00ccff', '#9966ff', '#ff6699'
  ];

  const highlightColors = [
    '#ffff00', '#00ff00', '#ff00ff', '#00ffff', '#ff6600', '#6600ff',
    '#ffcccc', '#ccffcc', '#ccccff', '#ffffcc', '#ffccff', '#ccffff'
  ];

  // Función para insertar imagen con ALT y título/caption
  const addImage = async () => {
    const url = window.prompt("URL de la imagen");
    if (!url) return;
    const alt = window.prompt("Texto ALT para SEO y accesibilidad") || "";
    const title = window.prompt("Título o leyenda de la imagen (opcional)") || "";
    editor.chain().focus().setImage({ src: url, alt, title }).run();
  };

  // Función para subir imagen desde disco (usa Supabase Storage)
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const alt = window.prompt("Texto ALT para SEO y accesibilidad") || "";
      const title = window.prompt("Título o leyenda de la imagen (opcional)") || "";
      editor.chain().focus().setImage({ src: urlData.publicUrl, alt, title }).run();
    } else {
      alert("No se pudo obtener la URL pública.");
    }
  };

  // Botones de alineación
  const alignBtn = (align: string, label: string) => (
    <button
      type="button"
      onClick={() => editor.chain().focus().setTextAlign(align).run()}
      style={{
        background: editor.isActive({ textAlign: align }) ? "#e0e0e0" : "white",
        border: "1px solid #ccc", borderRadius: 4, padding: "4px 8px"
      }}
      title={`Alinear ${label}`}
    >{label}</button>
  );

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 4,
      marginBottom: 8,
      padding: 6,
      background: "#fafafa",
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      position: "relative"
    }}>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita" style={{ fontWeight: editor.isActive('bold') ? "bold" : "normal" }}>B</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva" style={{ fontStyle: editor.isActive('italic') ? "italic" : "normal" }}>I</button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} title="Subrayado" style={{ textDecoration: editor.isActive('underline') ? "underline" : "none" }}>U</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Título 1" style={{ fontWeight: editor.isActive('heading', { level: 1 }) ? "bold" : "normal" }}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Título 2" style={{ fontWeight: editor.isActive('heading', { level: 2 }) ? "bold" : "normal" }}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Título 3" style={{ fontWeight: editor.isActive('heading', { level: 3 }) ? "bold" : "normal" }}>H3</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista con viñetas" style={{ fontWeight: editor.isActive('bulletList') ? "bold" : "normal" }}>• Lista</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada" style={{ fontWeight: editor.isActive('orderedList') ? "bold" : "normal" }}>1. Lista</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Cita" style={{ fontWeight: editor.isActive('blockquote') ? "bold" : "normal" }}>"Cita"</button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Bloque de código" style={{ fontWeight: editor.isActive('codeBlock') ? "bold" : "normal" }}>{'</>'}</button>
      {/* Color de texto */}
      <button
        type="button"
        onClick={() => setShowColorPicker(!showColorPicker)}
        title="Color de texto"
        style={{ border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', background: 'white', cursor: 'pointer' }}
      >
        <span style={{ width: 12, height: 12, background: editor.getAttributes('textStyle').color || '#000000', border: '1px solid #ccc', borderRadius: 2, display: 'inline-block', marginRight: 4 }} />
        A
      </button>
      {showColorPicker && (
        <div style={{
          position: 'absolute', top: 40, left: 0, zIndex: 1000, background: 'white', border: '1px solid #ccc', borderRadius: 4, padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, width: 180
        }}>
          {textColors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => { editor.chain().focus().setColor(color).run(); setShowColorPicker(false); }}
              style={{ width: 20, height: 20, background: color, border: '1px solid #ccc', borderRadius: 2, cursor: 'pointer' }}
              title={color}
            />
          ))}
          <input
            type="color"
            onChange={(e) => { editor.chain().focus().setColor(e.target.value).run(); setShowColorPicker(false); }}
            style={{ gridColumn: 'span 6', width: '100%', height: 24, border: '1px solid #ccc', borderRadius: 2, cursor: 'pointer' }}
          />
        </div>
      )}
      {/* Color de fondo/resaltado */}
      <button
        type="button"
        onClick={() => setShowHighlightPicker(!showHighlightPicker)}
        title="Color de fondo (resaltado)"
        style={{ border: '1px solid #ccc', borderRadius: 4, padding: '4px 8px', background: 'white', cursor: 'pointer' }}
      >
        <span style={{ width: 12, height: 12, background: editor.getAttributes('highlight').color || '#ffff00', border: '1px solid #ccc', borderRadius: 2, display: 'inline-block', marginRight: 4 }} />
        🖍️
      </button>
      {showHighlightPicker && (
        <div style={{
          position: 'absolute', top: 40, left: 220, zIndex: 1000, background: 'white', border: '1px solid #ccc', borderRadius: 4, padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, width: 180
        }}>
          <button
            type="button"
            onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false); }}
            style={{ gridColumn: 'span 6', padding: '4px 8px', border: '1px solid #ccc', borderRadius: 2, background: 'white', cursor: 'pointer' }}
          >Sin resaltado</button>
          {highlightColors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => { editor.chain().focus().setHighlight({ color }).run(); setShowHighlightPicker(false); }}
              style={{ width: 20, height: 20, background: color, border: '1px solid #ccc', borderRadius: 2, cursor: 'pointer' }}
              title={color}
            />
          ))}
          <input
            type="color"
            onChange={(e) => { editor.chain().focus().setHighlight({ color: e.target.value }).run(); setShowHighlightPicker(false); }}
            style={{ gridColumn: 'span 6', width: '100%', height: 24, border: '1px solid #ccc', borderRadius: 2, cursor: 'pointer' }}
          />
        </div>
      )}
      {/* Alineación */}
      {alignBtn("left", "Izq")}
      {alignBtn("center", "Centro")}
      {alignBtn("right", "Der")}
      {/* Links */}
      <button
        type="button"
        onClick={() => {
          const url = prompt('Pega la URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        title="Insertar enlace"
        style={{ fontWeight: editor.isActive('link') ? "bold" : "normal" }}
      >🔗</button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        title="Quitar enlace"
      >❌🔗</button>
      {/* Imagen vía URL */}
      <button type="button" onClick={addImage} title="Insertar imagen">🖼️ Imagen</button>
      {/* Subir imagen */}
      <label htmlFor="upload-image-toolbar" style={{ cursor: "pointer", padding: "4px 8px", border: "1px solid #ccc", borderRadius: 4, marginLeft: 4 }} title="Subir imagen">
        ⬆️ Subir imagen
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="upload-image-toolbar"
          onChange={handleUploadImage}
        />
      </label>
      {/* Galería */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setImageGallery().run()}
        title="Insertar galería"
        style={{ padding: "4px 8px", border: "1px solid #ccc", borderRadius: 4, marginLeft: 4, cursor: "pointer" }}
      >📸 Galería</button>
      {/* Tabla */}
      <button
        type="button"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="Insertar tabla"
      >↔️ Tabla</button>
      {/* Separador */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Insertar separador"
      >───</button>
    </div>
  );
}
